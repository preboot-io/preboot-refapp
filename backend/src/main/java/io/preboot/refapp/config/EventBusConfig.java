package io.preboot.refapp.config;

import io.preboot.eventbus.EventPublisher;
import io.preboot.eventbus.LocalAsynchronousEventPublisher;
import io.preboot.eventbus.LocalEventHandlerRepository;
import io.preboot.eventbus.LocalEventPublisher;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.task.VirtualThreadTaskExecutor;

@Configuration
class EventBusConfig {
    @Bean
    LocalEventHandlerRepository localEventHandlerRepository(ApplicationContext applicationContext) {
        return new LocalEventHandlerRepository(applicationContext);
    }

    @Bean
    @Primary
    EventPublisher eventPublisher(LocalEventHandlerRepository localEventHandlerRepository) {
        return new LocalEventPublisher(localEventHandlerRepository);
    }

    @Bean
    @Qualifier("async") // usage example: @Qualifier("async") EventPublisher eventPublisher
    EventPublisher asyncEventPublisher(LocalEventHandlerRepository localEventHandlerRepository) {
        return new LocalAsynchronousEventPublisher(
                localEventHandlerRepository, new VirtualThreadTaskExecutor("async-event-publisher"));
    }
}
