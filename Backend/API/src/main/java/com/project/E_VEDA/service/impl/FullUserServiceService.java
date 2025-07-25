package com.project.E_VEDA.service.impl;

import com.project.E_VEDA.common.utils.GenericResponseFactory;
import com.project.E_VEDA.domain.entity.FullUserDetails;
import com.project.E_VEDA.dto.fullUserDetails.ProfileDTO;
import com.project.E_VEDA.dto.response.GenericResponse;
import com.project.E_VEDA.mapping.GenericDtoMapper;
import com.project.E_VEDA.repository.IUserDetailsRepository;
import com.project.E_VEDA.service.interfaces.IFullUserDetailsService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * FullUserServiceService is a service that provides operations for managing user profiles.
 * This class extends BaseService and implements IFullUserDetailsService, offering support
 * for fetching, updating, and deleting user profile details.
 * <p>
 * The class uses dependencies such as GenericResponseFactory for response creation,
 * GenericDtoMapper for mapping data transfer objects, and IUserDetailsRepository for
 * repository operations. Transactions are managed for update and delete operations.
 * </p>
 * Key functionalities include: <br>
 * - Retrieving a user's profile by ID. <br>
 * - Updating or creating a user's profile based on input data. <br>
 * - Deleting a user's profile by ID. <br>
 */
@Slf4j
@Service("fullUserService")
public class FullUserServiceService extends BaseService implements IFullUserDetailsService {

    protected FullUserServiceService(GenericResponseFactory genericResponseFactory,
                                      GenericDtoMapper mapper,
                                      IUserDetailsRepository userDetailsRepository) {
        super(userDetailsRepository, genericResponseFactory, mapper);
    }

    /**
     * Retrieves the user profile for a given user ID.
     *
     * @param userId the unique identifier of the user whose profile is to be fetched
     * @return a {@link GenericResponse} containing the user profile data wrapped in a {@link ProfileDTO}
     * if the user is found, or an error response with a {@link HttpStatus#NOT_FOUND} status if the user
     * does not exist
     */
    @Override
    public GenericResponse<ProfileDTO> getProfile(String userId) {
        Optional<FullUserDetails> user = fetchUserDetails(userId);
        if (user.isEmpty()) {
            log.warn("User with ID {} not found.", userId);
            return genericResponseFactory.errorResponse(HttpStatus.NOT_FOUND,
                    null,
                    "user.profile.not.found");
        }
        log.info("User with ID {} found.", userId);
        return genericResponseFactory.successResponse(HttpStatus.OK,
                mapper.map(user, ProfileDTO.class),
                "user.profile.success");
    }

    /**
     * Updates an existing user profile or creates a new profile if it does not exist for the given user ID.
     * The method maps the provided profile data to a user entity, saves it to the repository, and returns
     * a successful response containing the updated profile details.
     *
     * @param userId the unique identifier of the user whose profile is to be updated
     * @param profileDTO the profile data transfer object containing the updated user information
     * @return a {@link GenericResponse} containing the updated profile data wrapped in a {@link ProfileDTO},
     * with an HTTP status of {@link HttpStatus#OK} and a success message
     */
    @Override
    @Transactional
    public GenericResponse<ProfileDTO> updateProfile(String userId, ProfileDTO profileDTO) {
        FullUserDetails userDetails = fetchUserDetails(userId)
                .orElseGet(() -> createNewProfile(userId));
        final FullUserDetails usertoSave = mapper.map(profileDTO, userDetails.getClass());
        usertoSave.setUid(userId);
        final FullUserDetails savedUser = userDetailsRepository.save(usertoSave);
        return genericResponseFactory.successResponse(HttpStatus.OK,
                mapper.map(savedUser, ProfileDTO.class),
                "user.profile.success");
    }

    /**
     * Deletes the user profile associated with the specified user ID.
     * If the user profile exists, it is removed from the database and a successful response
     * is returned. If the user profile does not exist, an error response with a
     * {@link HttpStatus#NOT_FOUND} status is returned.
     *
     * @param userId the unique identifier of the user whose profile is to be deleted
     * @return a {@link GenericResponse} object containing a success message with an
     * {@link HttpStatus#OK} status if the profile is deleted, or an error message with an
     * {@link HttpStatus#NOT_FOUND} status if the profile does not exist
     */
    @Override
    @Transactional
    public GenericResponse<ProfileDTO> deleteProfile(String userId) {
        Optional<FullUserDetails> userDetails = fetchUserDetails(userId);
        if (userDetails.isEmpty()) {
            return genericResponseFactory.errorResponse(HttpStatus.NOT_FOUND,
                    null,
                    "user.profile.not.found");
        }
        userDetailsRepository.deleteById(userId);
        return genericResponseFactory.successResponse(HttpStatus.OK,
                null,
                "user.profile.delete.success");
    }

    /**
     * Creates a new user profile based on the provided unique user identifier.
     *
     * @param userId the unique identifier of the user for whom the profile is being created
     * @return a new instance of {@link FullUserDetails} with the user ID set
     */
    private FullUserDetails createNewProfile(String userId) {
        FullUserDetails user = new FullUserDetails();
        user.setUid(userId);
        return user;
    }

}
