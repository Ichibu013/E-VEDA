package com.project.E_VEDA.common.utils;

import com.project.E_VEDA.dto.response.GenericResponse;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * GenericResponseFactory class to handle GenericResponse wrapper
 */
@Getter
@Component
public class GenericResponseFactory {

    private final MessageSource messageSource;

    @Autowired
    public GenericResponseFactory(final MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * successResponse
     * @param <T> the type parameter
     * @return the generic response
     */
    public <T> GenericResponse<T> successResponse(final HttpStatus httpStatus,final T data, final String messageKey) {
        return new GenericResponse<>(httpStatus,data, messageKey, messageSource);
    }

    /**
     * successResponse
     * @param <T> the type parameter
     * @return the generic response
     */
    public <T> GenericResponse<T> successResponse(final HttpStatus httpStatus,final T data, final String messageKey, final Object... args) {
        return new GenericResponse<>(httpStatus,data, messageKey, messageSource, args);
    }

    /**
     * errorResponse
     * @param <T> the type parameter
     * @return the generic response
     */
    public <T> GenericResponse<T> errorResponse(final HttpStatus httpStatus,final Map<String, String> errors, final String messageKey) {
        return new GenericResponse<>(httpStatus,errors, messageKey, messageSource);
    }

    /**
     * errorResponse
     *
     * @param <T> the type parameter
     * @return the generic response
     */
    public <T> GenericResponse<T> errorResponse(final HttpStatus httpStatus,final Map<String, String> errors, final String messageKey,
                                                final Object... args) {
        return new GenericResponse<>(httpStatus,errors, messageKey, messageSource, args);
    }

}