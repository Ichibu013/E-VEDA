package com.project.common.common.exceptions;

public class RegistrationFailedException extends RuntimeException {

    public RegistrationFailedException(String message, Throwable cause) {
        super(message, cause);
    }

    public RegistrationFailedException(String message) {
        super(message);
    }
}
