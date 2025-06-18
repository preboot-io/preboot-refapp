package io.preboot.refapp.config;

import io.preboot.auth.api.UserAccountSessionManagementApi;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@EnableScheduling
@RequiredArgsConstructor
class SessionCleanupJob {
    private final UserAccountSessionManagementApi userAccountSessionManagementApi;

    @Scheduled(fixedRate = 900000) // 15 min
    public void cleanExpiredSessions() {
        userAccountSessionManagementApi.cleanExpiredSessions(
                Instant.now()); // not gathering previous sessions data for analysis
    }
}
