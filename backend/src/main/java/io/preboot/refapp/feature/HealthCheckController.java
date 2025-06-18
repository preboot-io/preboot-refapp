package io.preboot.refapp.feature;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/healthcheck")
class HealthCheckController {
    @GetMapping
    public String healthCheck() {
        return "OK";
    }
}
