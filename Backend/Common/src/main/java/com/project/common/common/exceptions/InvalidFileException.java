package com.project.common.common.exceptions;

import lombok.Getter;

/**
 * InvalidFileException is a custom exception class used for handling errors
 * related to invalid files in the application.
 * <p>
 * This exception extends RuntimeException, meaning it is unchecked and
 * indicates a scenario where an operation involving a file fails due to
 * invalid conditions. It supports conveying detailed error information
 * using an error message and optional arguments to provide additional context.
 * </p> <p>
 * Fields: <br>
 * - errorMessage: A string providing a descriptive error message. <br>
 * - arguments: Additional information related to the error, stored as an object array. <br>
 * </p>
 * Constructors: <br>
 * - InvalidFileException(String errorMessage, Object[] arguments): Allows the creation
 *   of an instance with a specific error message and additional arguments. <br>
 * - InvalidFileException(String errorMessage): Allows the creation of an instance with
 *   just the error message. <br>
 */
@Getter
public class InvalidFileException extends RuntimeException {

    private final String errorMessage;

    private final Object[] arguments;

    /**
     * Constructs a new InvalidFileException with a specified error message
     * and additional arguments providing further context about the exception.
     *
     * @param errorMessage A descriptive error message explaining the invalid file error.
     * @param arguments An optional array of objects providing additional information or context.
     */
    public InvalidFileException(String errorMessage, Object[] arguments) {
        super("error.internal");
        this.errorMessage = errorMessage;
        this.arguments = arguments;
    }

    /**
     * Constructs a new InvalidFileException with a specified error message.
     *
     * @param errorMessage A descriptive error message explaining the invalid file error.
     */
    public InvalidFileException(String errorMessage) {
        super("error.internal");
        this.errorMessage = errorMessage;
        this.arguments = null;
    }
}
