package com.api.yneformaycheun.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Documentation OpenAPI de l'API, avec le schéma d'authentification « bearer »
 * (JWT) déclaré pour que Swagger UI propose un champ de saisie du jeton.
 */
@Configuration
public class OpenApiConfig {

    private static final String SCHEME = "bearerAuth";

    @Bean
    public OpenAPI yneformaycheunOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Yneformaycheun API")
                        .description("API REST d'agrégation de flux RSS technologiques")
                        .version("v1"))
                .addSecurityItem(new SecurityRequirement().addList(SCHEME))
                .schemaRequirement(SCHEME, new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT"));
    }
}
