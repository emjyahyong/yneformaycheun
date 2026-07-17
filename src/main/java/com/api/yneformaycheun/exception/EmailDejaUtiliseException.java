package com.api.yneformaycheun.exception;

/** Levée à l'inscription lorsque l'e-mail est déjà associé à un compte. */
public class EmailDejaUtiliseException extends RuntimeException {

    public EmailDejaUtiliseException(String email) {
        super("Un compte existe déjà pour l'e-mail : " + email);
    }
}
