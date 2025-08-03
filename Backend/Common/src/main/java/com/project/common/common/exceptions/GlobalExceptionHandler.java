package com.project.common.common.exceptions;

import com.project.common.common.utils.GenericResponseFactory;
import com.project.common.dto.response.GenericResponse;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

/**
 * GlobalExceptionHandler is a centralized exception-handling class designed to handle
 * specific application exceptions and provide meaningful responses for the client.
 * It extends RuntimeException and utilizes Spring's @RestControllerAdvice
 * to intercept exceptions across controllers.
 * <p>
 *
 * Exception handlers: <br>
 * - handleResourceNotFoundException: Handles ResourceNotFoundException. <br>
 * - handleInvalidFileException: Handles InvalidFileException. <br>
 * - handleLoginFailedException: Handles LoginFailedException. <br>
 * - handleRegistrationFailedException: Handles RegistrationFailedException. <br>
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends RuntimeException {

    private final GenericResponseFactory genericResponseFactory;

    public GlobalExceptionHandler(GenericResponseFactory genericResponseFactory) {
        this.genericResponseFactory = genericResponseFactory;
    }

    /**
     * Handles the {@link ResourceNotFoundException} and generates a structured response
     * with error details, HTTP status, and error message.
     *
     * @param ex the {@link ResourceNotFoundException} thrown when a requested resource is not found
     * @return a {@link ResponseEntity} containing a {@link GenericResponse} object
     *         populated with HTTP status, error message, and additional error metadata
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<GenericResponse<Map<String, String>>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        log.error("Resource not found: {}", ex.getMessage());
        return ResponseEntity
                .ok()
                .body(genericResponseFactory
                        .errorResponse(
                                HttpStatus.NOT_FOUND,
                                getErrorDetails(ex),
                                "resource.not.found")
                );
    }

    /**
     * Handles the {@link InvalidFileException} and generates a structured response
     * with error details, HTTP status, and error message.
     *
     * @param ex the {@link InvalidFileException} thrown when an invalid file is encountered
     * @return a {@link ResponseEntity} containing a {@link GenericResponse} object
     *         populated with HTTP status, error message, and additional error metadata
     */
    @ExceptionHandler(InvalidFileException.class)
    public ResponseEntity<GenericResponse<Map<String, String>>> handleInvalidFileException(InvalidFileException ex) {
        log.error("Invalid file: {}", ex.getMessage());
        return ResponseEntity
                .ok()
                .body(genericResponseFactory
                        .errorResponse(
                                HttpStatus.BAD_REQUEST,
                                getErrorDetails(ex),
                                "invalid.file")
                );
    }

    /**
     * Handles the {@link LoginFailedException} and generates a structured response
     * with error details, HTTP status, and an error message.
     *
     * @param ex the {@link LoginFailedException} thrown when a login attempt fails
     * @return a {@link ResponseEntity} containing a {@link GenericResponse} object
     *         populated with HTTP status, error message, and additional error metadata
     */
    @ExceptionHandler(LoginFailedException.class)
    public ResponseEntity<GenericResponse<Map<String, String>>> handleLoginFailedException(LoginFailedException ex) {
        log.error("Login failed: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(genericResponseFactory.errorResponse(
                        HttpStatus.UNAUTHORIZED,
                        getErrorDetails(ex),
                        "user.login.failed")
                );
    }

    /**
     * Handles the {@link RegistrationFailedException} and generates a structured response
     * with error details, HTTP status, and an appropriate error message.
     *
     * @param ex the {@link RegistrationFailedException} thrown when a registration attempt fails
     * @return a {@link ResponseEntity} containing a {@link GenericResponse} object
     *         populated with HTTP status, error details, and an error message
     */
    @ExceptionHandler(RegistrationFailedException.class)
    public ResponseEntity<GenericResponse<Map<String,String>>> handleRegistrationFailedException(RegistrationFailedException ex){
        log.error("Registration failed: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(genericResponseFactory
                        .errorResponse(
                                HttpStatus.BAD_REQUEST,
                                getErrorDetails(ex),
                                "user.registration.failed")
                );
    }

    @ExceptionHandler(NoUserProfileException.class)
    public ResponseEntity<GenericResponse<Map<String,String>>> handleNoUserProfileException(NoUserProfileException ex){
        log.error("No user profile found: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(genericResponseFactory
                        .errorResponse(
                                HttpStatus.NOT_FOUND,
                                getErrorDetails(ex),
                                "user.profile.not.found")
                );
    }

    @ExceptionHandler(PassTokenInvalidException.class)
    public ResponseEntity<GenericResponse<Map<String,String>>> handlePassTokenInvalidException(PassTokenInvalidException exc){
        log.error("Pass token invalid: {}", exc.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(genericResponseFactory
                    .errorResponse(
                            HttpStatus.BAD_REQUEST,
                            getErrorDetails(exc),
                            "user.pass.token.invalid"
                    )
                );
    }

    /**
     * Extracts error details from the provided exception by recursively traversing
     * the exception cause chain and returning a map containing an error message.
     * If no specific details are found in the exception cause, it defaults to the
     * message of the given exception.
     *
     * @param ex the {@link Throwable} instance from which error details are to be extracted
     * @return a {@link Map} containing error details, typically with a key "message"
     *         and its corresponding description
     */
    private Map<String, String> getErrorDetails(Throwable ex) {
        Map<String, String> errorDetails = null;
        if (ex.getCause() != null) {
            errorDetails = getErrorDetails(ex.getCause());
        }
        if (errorDetails == null) {
            errorDetails = Map.of("message", ex.getMessage());
        }
        return errorDetails;
    }
}
