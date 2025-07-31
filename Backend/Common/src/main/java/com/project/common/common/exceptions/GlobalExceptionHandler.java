package com.project.common.common.exceptions;

import com.project.common.common.utils.GenericResponseFactory;
import com.project.common.dto.response.GenericResponse;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
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
 * This handler leverages a GenericResponseFactory to construct structured responses,
 * encapsulating error details, HTTP status, messages, and metadata in a unified format.
 * Two custom exceptions, ResourceNotFoundException and InvalidFileException, are managed
 * by this handler, ensuring consistent JSON responses for not found and invalid file errors.
 * </p> <p>
 * Logging is integrated to capture detailed information about errors for troubleshooting
 * and debugging purposes.
 * </p> <p>
 * Dependencies: <br>
 * - GenericResponseFactory: Facilitates creation of standard response objects. <br>
 * - MessageSource: Provides localized error messages as part of the response. <br>
 * </p>
 * Exception handlers: <br>
 * - handleResourceNotFoundException: Handles ResourceNotFoundException. <br>
 * - handleInvalidFileException: Handles InvalidFileException. <br>
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends RuntimeException {

    private final GenericResponseFactory genericResponseFactory;
    private final MessageSource messageSource;

    public GlobalExceptionHandler(GenericResponseFactory genericResponseFactory,
                                  MessageSource messageSource) {
        this.genericResponseFactory = genericResponseFactory;
        this.messageSource = messageSource;
    }

    /**
     * Handles the {@link ResourceNotFoundException} and provides a structured response
     * containing detailed error information.
     *
     * @param ex the {@link ResourceNotFoundException} thrown when a requested resource is not found
     * @return a {@link ResponseEntity} containing a {@link GenericResponse} object
     *         populated with HTTP status, error message, and metadata
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<GenericResponse<Map<String, String>>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        final GenericResponse<Map<String, String>> response = genericResponseFactory.errorResponse(HttpStatus.NOT_FOUND,
                null,
                ex.getMessage(),
                ex.getCause());
        log.error("Resource not found: {}", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.OK);
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
        final GenericResponse<Map<String, String>> response = genericResponseFactory.errorResponse(HttpStatus.BAD_REQUEST,
                null,
                ex.getMessage(),
                ex.getCause());
        log.error("Invalid file: {}", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
