package com.project.Gateway.service.impl;

import com.project.Gateway.common.utils.GenericResponseFactory;
import com.project.Gateway.mapping.GenericDtoMapper;

/**
 * BaseService is an abstract class that provides foundational functionality for service
 * components by integrating common resources, such as a response factory and an object
 * mapper, which can be utilized by derived service classes.
 * <p>
 * This class serves as a base for services that require uniform mechanisms to create
 * generic responses and map between data transfer objects (DTOs) and entities.
 */
public class BaseService {

    protected final GenericResponseFactory genericResponseFactory;

    protected final GenericDtoMapper mapper;

    protected BaseService(final GenericResponseFactory genericResponseFactory,
                          GenericDtoMapper mapper) {
        this.genericResponseFactory = genericResponseFactory;
        this.mapper = mapper;
    }

}
