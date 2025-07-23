package com.project.E_VEDA.service.impl;

import com.project.E_VEDA.common.utils.GenericResponseFactory;
import com.project.E_VEDA.domain.entity.FullUserDetails;
import com.project.E_VEDA.mapping.GenericDtoMapper;
import com.project.E_VEDA.repository.IUserDetailsRepository;

/**
 * BaseService is an abstract class that provides foundational functionality for service
 * components by integrating common resources, such as a response factory and an object
 * mapper, which can be utilized by derived service classes.
 * <p>
 * This class serves as a base for services that require uniform mechanisms to create
 * generic responses and map between data transfer objects (DTOs) and entities.
 */
public class BaseService {

    protected final IUserDetailsRepository userDetailsRepository;

    protected final GenericResponseFactory genericResponseFactory;

    protected final GenericDtoMapper mapper;

    protected BaseService(IUserDetailsRepository userDetailsRepository,
                          final GenericResponseFactory genericResponseFactory,
                          GenericDtoMapper mapper) {
        this.userDetailsRepository = userDetailsRepository;
        this.genericResponseFactory = genericResponseFactory;
        this.mapper = mapper;
    }

    protected FullUserDetails fetchUserDetails(String userId) {
        return userDetailsRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: ID " + userId));
    }
}
