package com.api.yneformaycheun.exception;

import com.api.yneformaycheun.dto.ErrorDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Centralise les cas d'exception en un format d'erreur JSON homogène
 * ({@link ErrorDto}), évitant de dupliquer des blocs try/catch dans chaque
 * contrôleur.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(InvalidRssUrlException.class)
    public ResponseEntity<ErrorDto> urlInvalide(InvalidRssUrlException e) {
        return ResponseEntity.badRequest().body(new ErrorDto("URL_INVALIDE", e.getMessage()));
    }

    @ExceptionHandler(SourceIntrouvableException.class)
    public ResponseEntity<ErrorDto> sourceIntrouvable(SourceIntrouvableException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorDto("SOURCE_INTROUVABLE", e.getMessage()));
    }

    @ExceptionHandler(ArticleIntrouvableException.class)
    public ResponseEntity<ErrorDto> articleIntrouvable(ArticleIntrouvableException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorDto("ARTICLE_INTROUVABLE", e.getMessage()));
    }

    @ExceptionHandler(EmailDejaUtiliseException.class)
    public ResponseEntity<ErrorDto> emailDejaUtilise(EmailDejaUtiliseException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorDto("EMAIL_DEJA_UTILISE", e.getMessage()));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorDto> mauvaisIdentifiants(BadCredentialsException e) {
        log.warn("Échec d'authentification : identifiants invalides");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorDto("IDENTIFIANTS_INVALIDES", "E-mail ou mot de passe incorrect"));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorDto> accesRefuse(AccessDeniedException e) {
        log.warn("Accès refusé : {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ErrorDto("ACCES_REFUSE", "Ressource inaccessible"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDto> validation(MethodArgumentNotValidException e) {
        FieldError premiere = e.getBindingResult().getFieldError();
        String message = premiere != null ? premiere.getDefaultMessage() : "Requête invalide";
        return ResponseEntity.badRequest().body(new ErrorDto("VALIDATION", message));
    }
}
