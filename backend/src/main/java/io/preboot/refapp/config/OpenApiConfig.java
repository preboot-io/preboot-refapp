package io.preboot.refapp.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;

@Configuration
public class OpenApiConfig {

    public OpenApiCustomizer authSchemaCustomizer() {
        return openApi -> {
            // Ensure components exist
            if (openApi.getComponents() == null) {
                openApi.setComponents(new Components());
            }

            // First add security scheme
            openApi.getComponents()
                    .addSecuritySchemes(
                            "bearer-jwt",
                            new SecurityScheme()
                                    .type(SecurityScheme.Type.HTTP)
                                    .scheme("bearer")
                                    .bearerFormat("JWT")
                                    .in(SecurityScheme.In.HEADER)
                                    .name("Authorization"));

            // Add global security requirement
            openApi.addSecurityItem(new SecurityRequirement().addList("bearer-jwt"));
        };
    }

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("api")
                .pathsToMatch("/auth/**", "/health", "/api/**")
                .addOpenApiCustomizer(authSchemaCustomizer())
                .build();
    }
}
