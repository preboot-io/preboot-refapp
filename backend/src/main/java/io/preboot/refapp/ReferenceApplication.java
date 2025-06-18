package io.preboot.refapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jdbc.repository.config.EnableJdbcRepositories;

@SpringBootApplication
@EnableJdbcRepositories(basePackages = {"io.preboot"})
public class ReferenceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReferenceApplication.class, args);
    }
}
