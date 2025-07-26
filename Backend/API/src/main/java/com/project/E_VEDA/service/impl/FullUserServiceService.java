package com.project.E_VEDA.service.impl;

import com.project.E_VEDA.repository.IUserDetailsRepository;
import com.project.E_VEDA.domain.entity.FullUserDetails;
import com.project.E_VEDA.dto.fullUserDetails.ProfileDTO;
import com.project.E_VEDA.service.interfaces.IFullUserDetailsService;

import com.project.common.dto.response.GenericResponse;
import com.project.common.mapping.GenericDtoMapper;
import com.project.common.common.utils.GenericResponseFactory;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service class for handling user profiles and their related operations such as retrieval, update, and deletion.
 * It extends {@link BaseService} and implements {@link IFullUserDetailsService}.
 * This service is annotated as a Spring {@link Service} and utilizes logging through the {@link Slf4j} annotation.
 */
@Slf4j
@Service("fullUserService")
public class FullUserServiceService extends BaseService implements IFullUserDetailsService {

    protected FullUserServiceService(IUserDetailsRepository userDetailsRepository,
                                  GenericResponseFactory genericResponseFactory,
                                  GenericDtoMapper mapper) {
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
        return buildSuccessResponse(mapper.map(user, ProfileDTO.class),"user.profile.success");
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
        final FullUserDetails userToSave = mapper.map(profileDTO, userDetails.getClass());
        userToSave.setUid(userId);
        final FullUserDetails savedUser = userDetailsRepository.save(userToSave);
        return buildSuccessResponse(mapper.map(savedUser, ProfileDTO.class),"user.profile.success");
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
        log.info("User profile for user ID {} deleted successfully.", userId);
        return buildSuccessResponse(null,"user.profile.delete.success");
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
