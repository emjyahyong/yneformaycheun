package com.api.yneformaycheun.service;

import com.api.yneformaycheun.dto.LoginDto;
import com.api.yneformaycheun.dto.RegisterDto;
import com.api.yneformaycheun.exception.EmailDejaUtiliseException;
import com.api.yneformaycheun.model.User;
import com.api.yneformaycheun.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Inscription et authentification. Le mot de passe est haché (BCrypt), jamais
 * stocké ni journalisé en clair ; la connexion renvoie un jeton JWT.
 */
@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public User register(RegisterDto dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new EmailDejaUtiliseException(dto.email());
        }
        String hash = passwordEncoder.encode(dto.password());
        return userRepository.save(new User(dto.email(), dto.username(), hash));
    }

    public String login(LoginDto dto) {
        User user = userRepository.findByEmail(dto.email())
                .orElseThrow(() -> {
                    log.warn("Échec d'authentification pour {} : compte inexistant", dto.email());
                    return new BadCredentialsException("Identifiants invalides");
                });
        if (!passwordEncoder.matches(dto.password(), user.getPasswordHash())) {
            log.warn("Échec d'authentification pour {} : mot de passe incorrect", dto.email());
            throw new BadCredentialsException("Identifiants invalides");
        }
        return jwtService.genererToken(user.getEmail());
    }
}
