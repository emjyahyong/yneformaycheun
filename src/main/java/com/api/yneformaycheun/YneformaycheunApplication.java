package com.api.yneformaycheun;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.scheduling.annotation.EnableScheduling;

// L'authentification repose sur JWT : on exclut le UserDetailsService par
// défaut de Spring Security (et son mot de passe généré au démarrage).
@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
@EnableScheduling
public class YneformaycheunApplication {

	public static void main(String[] args) {
		SpringApplication.run(YneformaycheunApplication.class, args);
	}

}
