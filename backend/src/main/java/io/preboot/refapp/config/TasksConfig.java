package io.preboot.refapp.config;

import io.preboot.eventbus.EventPublisher;
import io.preboot.eventbus.tasks.ExpandingTimeOfBackOffPolicy;
import io.preboot.eventbus.tasks.TaskConfigFactory;
import io.preboot.eventbus.tasks.TaskPublisher;
import io.preboot.eventbus.tasks.TaskRepository;
import io.preboot.eventbus.tasks.TaskRunner;
import io.preboot.eventbus.tasks.TimeBasedDeadQueuePolicy;
import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.Semaphore;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskExecutor;
import org.springframework.core.task.VirtualThreadTaskExecutor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Configuration
@EnableScheduling
class TasksConfig {
    @Bean
    TaskRepository taskRepository(TaskConfigFactory taskConfigFactory) {
        return taskConfigFactory.createTaskRepository("tasks");
    }

    @Bean
    TaskPublisher taskPublisher(TaskConfigFactory taskConfigFactory, TaskRepository taskRepository) {
        return taskConfigFactory.createTaskPublisher(taskRepository);
    }

    @Bean
    TaskRunner taskRunner(
            TaskConfigFactory taskConfigFactory, EventPublisher synchEventPublisher, TaskRepository taskRepository) {
        return taskConfigFactory.createTaskRunner(
                synchEventPublisher,
                taskRepository,
                new TimeBasedDeadQueuePolicy(Duration.ofDays(15)),
                new ExpandingTimeOfBackOffPolicy(Duration.ofMinutes(2), 60, 2, 60 * 24));
    }

    @Service
    @RequiredArgsConstructor
    @Slf4j
    static class TaskRunnerJob {
        @Value("${app.task-runner.max-concurrent-tasks}")
        private int maxConcurrentTasks;

        private final TaskRunner taskRunner;
        private final TaskExecutor taskExecutor = new VirtualThreadTaskExecutor("task-runner");
        private final Semaphore semaphore = new Semaphore(maxConcurrentTasks);

        @Scheduled(fixedRate = 1000)
        void run() {
            // Try to schedule as many tasks as possible
            for (int i = 0; i < maxConcurrentTasks; i++) {
                if (!taskRunner.hasPendingTasks()) {
                    log.debug("No more pending tasks, exiting the loop at iteration {}", i);
                    break; // Exit the loop if no more pending tasks
                }

                if (semaphore.tryAcquire()) {
                    log.debug("Acquired permit, executing task at iteration {}", i);
                    taskExecutor.execute(() -> {
                        try {
                            final String taskType = taskRunner.runTask();
                            log.debug("Task {} executed", taskType);
                        } finally {
                            semaphore.release();
                        }
                    });
                } else {
                    // No more permits available, break the loop as tasks are still running
                    break;
                }
            }
        }

        @Scheduled(fixedRate = 180000) // 3 minutes
        void updateHeartbeat() {
            taskRunner.updateHeartbeat();
        }

        @Scheduled(fixedRate = 900000) // 15 minutes
        void retrieveStalledTasks() {
            taskRunner.retrieveStalledTasks(Instant.now().minus(Duration.ofMinutes(15)));
        }
    }
}
