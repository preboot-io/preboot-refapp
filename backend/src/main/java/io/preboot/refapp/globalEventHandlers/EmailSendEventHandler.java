package io.preboot.refapp.globalEventHandlers;

import io.preboot.eventbus.EventHandler;
import io.preboot.notifications.spi.event.EmailSentEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class EmailSendEventHandler {
    @EventHandler
    public void onEmailSendEvent(EmailSentEvent emailSentEvent) {
        log.info("Email send to: {}", emailSentEvent.getReceiver());
    }
}
