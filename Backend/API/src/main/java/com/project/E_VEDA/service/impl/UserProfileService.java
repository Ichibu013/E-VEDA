package com.project.E_VEDA.service.impl;

import com.project.E_VEDA.domain.entity.FullUserDetails;
import com.project.E_VEDA.dto.fullUserDetails.ProfileDTO;
import com.project.E_VEDA.repository.IUserDetailsRepository;
import com.project.E_VEDA.service.interfaces.IUserProfileService;
import com.project.common.common.exceptions.NoUserProfileException;
import com.project.common.common.utils.GenericResponseFactory;
import com.project.common.dto.response.GenericResponse;
import com.project.common.mapping.GenericDtoMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service class for handling user profiles and their related operations such as retrieval, update, and deletion.
 * It extends {@link BaseService} and implements {@link IUserProfileService}.
 * This service is annotated as a Spring {@link Service} and utilizes logging through the {@link Slf4j} annotation.
 */
@Slf4j
@Service("userProfileService")
public class UserProfileService extends BaseService implements IUserProfileService {

    public UserProfileService(IUserDetailsRepository userDetailsRepository,
                              MessageSource messageSource,
                              GenericResponseFactory genericResponseFactory,
                              GenericDtoMapper mapper) {
        super(userDetailsRepository, messageSource, genericResponseFactory, mapper);
    }

    /**
     * Retrieves the user profile associated with the specified user ID.
     * If a profile with the given user ID exists, it is mapped to a ProfileDTO
     * and returned as part of a successful response. If no profile is found,
     * a NoUserProfileException is thrown, indicating that the profile does not exist.
     *
     * @param userId the unique identifier of the user whose profile is being requested
     * @return a {@link GenericResponse} containing the user profile wrapped in a {@link ProfileDTO}
     * along with a success message
     * @throws NoUserProfileException if the user profile associated with the given ID is not found
     */
    @Override
    public GenericResponse<ProfileDTO> getProfile(String userId) {
        Optional<FullUserDetails> user = fetchUserDetails(userId);
        if (user.isEmpty()) {
            log.warn("User with ID {} not found.", userId);
            throw new NoUserProfileException("No User with ID " + userId + " found. Please check the user ID and try again.");
        }
        log.info("User with ID {} found.", userId);
        return buildSuccessResponse(mapper.map(user.get(), ProfileDTO.class),"user.profile.success");
    }

    /**
     * Creates or updates a user profile based on the provided user ID and profile data.
     * If a profile associated with the user ID exists, it is updated with the new data from ProfileDTO.
     * Otherwise, a new profile is created and saved to the repository.
     *
     * @param userId the unique identifier of the user whose profile is to be created or updated
     * @param profileDTO the data transfer object containing the profile information to be saved
     * @return a {@link GenericResponse} object containing the updated or newly created profile
     *         wrapped in a {@link ProfileDTO} along with a success message
     */
    @Override
    @Transactional
    public GenericResponse<ProfileDTO> createAndUpdateProfile(String userId, ProfileDTO profileDTO) {
        FullUserDetails userDetails = fetchUserDetails(userId)
                .orElseGet(() -> createNewProfile(userId));
        final FullUserDetails userToSave = mapper.map(profileDTO, userDetails.getClass());
        userToSave.setUid(userId);
        final FullUserDetails savedUser = userDetailsRepository.save(userToSave);
        return buildSuccessResponse(mapper.map(savedUser, ProfileDTO.class),"user.profile.success");
    }

    /**
     * Deletes a user profile associated with the specified user ID.
     * If the profile exists, it is removed from the repository. Otherwise,
     * a {@link NoUserProfileException} is thrown, indicating that no user profile
     * was found for the provided user ID.
     *
     * @param userId the unique identifier of the user whose profile is to be deleted
     * @return a {@link GenericResponse} with a success message indicating that the
     * user profile was deleted successfully
     * @throws NoUserProfileException if no user profile is found for the given user ID
     */
    @Override
    @Transactional
    public GenericResponse<ProfileDTO> deleteProfile(String userId) {
        Optional<FullUserDetails> userDetails = fetchUserDetails(userId);
        if (userDetails.isEmpty()) {
            log.warn("User profile for user ID {} not found.", userId);
            throw new NoUserProfileException("No User profile found for user ID " + userId + ". Please check the user ID and try again.");
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
