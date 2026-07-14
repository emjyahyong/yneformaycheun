package com.api.yneformaycheun.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Dev-only: toutes les routes sont ouvertes tant que l'authentification de
 * l'API n'a pas été conçue. À restreindre avant toute mise en prod.
 */
@Configuration
public class SecurityConfig {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
			.csrf(csrf -> csrf.disable())
			.authorizeHttpRequests(auth -> auth.anyRequest().permitAll());

		return http.build();
	}

}
