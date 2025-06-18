package io.preboot.refapp.exception;

import java.time.LocalDateTime;
import java.util.UUID;

// Custom error response class
public class ErrorResponse {
    private final int status;
    private final String error;
    private final String message;
    private final String path;
    private final LocalDateTime timestamp;
    private final UUID uuid = UUID.randomUUID();

    public ErrorResponse(int status, String error, String message, String path) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
        this.timestamp = LocalDateTime.now();
    }

    // Getters
    public int getStatus() {
        return status;
    }

    public String getError() {
        return error;
    }

    public String getMessage() {
        return message;
    }

    public String getPath() {
        return path;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public UUID getUuid() {
        return uuid;
    }
}
