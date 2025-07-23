package com.project.E_VEDA.common.exceptions;

import lombok.Getter;

/**
 * ResourceNotFoundException is a custom exception class used to indicate that a
 * requested resource could not be found.
 * <p>
 * This exception extends RuntimeException and provides additional context
 * through an error message and optional arguments. It is intended to be used
 * in scenarios where a resource is not found in the application, and meaningful
 * information needs to be conveyed to the client.
 * </p> <p>
 * Fields: <br>
 * - errorMessage: A descriptive error message explaining the resource-related issue. <br>
 * - arguments: Optional additional details or context, stored as an array of objects. <br>
 * </p>
 * Constructors: <br>
 * - ResourceNotFoundException(String errorMessage, Object[] arguments): Initializes the
 *   exception with a specific error message and additional arguments. <br>
 * - ResourceNotFoundException(String errorMessage): Initializes the exception with
 *   just the error message. <br>
 */
@Getter
public class ResourceNotFoundException extends RuntimeException {

    private final String errorMessage;

    private final Object[] arguments;


    /**
     * Constructs a new ResourceNotFoundException with a specified error message
     * and additional arguments providing further context about the exception.
     *
     * @param errorMessage A descriptive error message explaining why the resource could not be found.
     * @param arguments An optional array of objects providing additional information or context.
     */
    public ResourceNotFoundException(String errorMessage,
                                     Object[] arguments) {
        super("error.internal");
        this.errorMessage = errorMessage;
        this.arguments = arguments;
    }

    /**
     * Constructs a new ResourceNotFoundException with a specified error message.
     *
     * @param errorMessage A descriptive error message explaining why the resource could not be found.
     */
    public ResourceNotFoundException(String errorMessage) {
        super("error.internal");
        this.errorMessage = errorMessage;
        this.arguments = null;
    }
}
