package io.preboot.refapp.globalEventHandlers;

import io.preboot.auth.api.event.UserAccountCreatedEvent;
import io.preboot.eventbus.EventHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class UserAccountEventsHandler {
    @EventHandler
    public void onUserAccountCreatedEvent(UserAccountCreatedEvent event) {
        log.info("User account created: '{}' - {}", event.userAccountId(), event.username());
    }
}
