package io.preboot.refapp.config;

import io.preboot.core.json.JsonMapper;
import io.preboot.core.json.JsonMapperFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
class JsonMapperConfig {
    private final JsonMapper jsonMapper = JsonMapperFactory.createJsonMapper();

    @Bean
    JsonMapper jsonMapper() {
        return jsonMapper;
    }

    @Bean
    @Primary
    ObjectMapper objectMapper() {
        return jsonMapper.getObjectMapper();
    }
}
