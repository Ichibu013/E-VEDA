package com.project.E_VEDA.service.impl;

import com.project.E_VEDA.domain.entity.FullUserDetails;
import com.project.E_VEDA.repository.IUserDetailsRepository;
import com.project.common.common.utils.GenericResponseFactory;
import com.project.common.dto.response.GenericResponse;
import com.project.common.mapping.GenericDtoMapper;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;

import java.util.Optional;

/**
 * com.project.E_VEDA.service.impl.BaseService is an abstract class that provides foundational functionality for service
 * components by integrating common resources, such as a response factory and an object
 * mapper, which can be utilized by derived service classes.
 * <p>
 * This class serves as a base for services that require uniform mechanisms to create
 * generic responses and map between data transfer objects (DTOs) and entities.
 */
public class BaseService {

    protected final IUserDetailsRepository userDetailsRepository;

    private final MessageSource messageSource;

    protected final GenericResponseFactory genericResponseFactory;

    protected final GenericDtoMapper mapper;

    protected BaseService(IUserDetailsRepository userDetailsRepository, MessageSource messageSource,
                          GenericResponseFactory genericResponseFactory,
                          GenericDtoMapper mapper) {
        this.userDetailsRepository = userDetailsRepository;
        this.messageSource = messageSource;
        this.genericResponseFactory = genericResponseFactory;
        this.mapper = mapper;
    }

    protected Optional<FullUserDetails> fetchUserDetails(String userId) {
        return userDetailsRepository.findById(userId);
    }

    protected   <T> GenericResponse<T> buildSuccessResponse(T data, String message) {
        return genericResponseFactory.successResponse(HttpStatus.OK, data, message,messageSource);
    }

}
