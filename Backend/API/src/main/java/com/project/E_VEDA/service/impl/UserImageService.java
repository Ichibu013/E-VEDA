package com.project.E_VEDA.service.impl;

import com.project.E_VEDA.domain.entity.FullUserDetails;
import com.project.E_VEDA.domain.entity.UserImage;
import com.project.E_VEDA.repository.IUserDetailsRepository;
import com.project.E_VEDA.repository.IUserImageRepository;
import com.project.E_VEDA.service.interfaces.IUserImageService;

import com.project.common.common.exceptions.InvalidFileException;
import com.project.common.common.exceptions.ResourceNotFoundException;
import com.project.common.common.utils.GenericResponseFactory;
import com.project.common.dto.response.GenericResponse;
import com.project.common.mapping.GenericDtoMapper;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

/**
 * Service class responsible for managing user images. This includes
 * handling image upload, update, retrieval, and deletion functionalities
 * for a user. The service uses an {@code IUserImageRepository} to perform
 * persistence operations and relies on a set of validations to ensure
 * proper handling of images.
 * <p>
 * Constraints:
 * - The file size should not exceed 5 MB.
 * - File validation must occur before any other operation.
 * </p>
 * This class extends {@code BaseService} to inherit common functionality
 * and implements {@code IUserImageService} interface to provide concrete
 * implementations for the defined methods.
 */
@Service("userImageService")
public class UserImageService extends BaseService implements IUserImageService {

    private static final long MAX_FILE_SIZE = 1024 * 1024 * 5;
    private final IUserImageRepository userImageRepository;


    public UserImageService(IUserDetailsRepository userDetailsRepository,
                            GenericResponseFactory genericResponseFactory,
                            GenericDtoMapper mapper,
                            IUserImageRepository userImageRepository) {
        super(userDetailsRepository, genericResponseFactory, mapper);
        this.userImageRepository = userImageRepository;
    }

    /**
     * Handles the upload of an image for a specified user, validating the file
     * and updating the existing user image or creating a new one if none exists.
     *
     * @param userId the unique identifier of the user for whom the image is being uploaded
     * @param file   the image file to upload; must be a valid, non-empty file and within size constraints
     * @return a {@code GenericResponse} containing information about the success or failure of the operation
     * @throws InvalidFileException      if the provided file is null, empty, or exceeds the maximum allowed size
     * @throws ResourceNotFoundException if no user details are found for the specified user ID
     */
    @Override
    @Transactional
    public GenericResponse<MultipartFile> uploadImage(String userId, MultipartFile file) {
        validateFile(file);

        Optional<FullUserDetails> userDetails = fetchUserDetails(userId);
        if (userDetails.isEmpty()) {
            return genericResponseFactory.errorResponse(
                    HttpStatus.NOT_FOUND,
                    null,
                    "user.not.found"
            );
        }
        UserImage existingUserImage = userImageRepository.findImageByUid(userId)
                .orElseGet(() -> createNewUserImage(userId));

        updateImageBytes(existingUserImage, file);
        userImageRepository.save(existingUserImage);

        return buildSuccessResponse(null, "user.image.upload.success");
    }

    /**
     * Updates the image associated with the specified user. If a user image
     * already exists, it is replaced with the provided new image file.
     *
     * @param userId the unique identifier of the user whose image is to be updated
     * @param file   the new image file to update; must be a valid non-empty file and within size constraints
     * @throws InvalidFileException      if the provided file is null, empty, or exceeds the maximum allowed size
     * @throws ResourceNotFoundException if no existing image is found for the specified user ID
     */
    @Override
    @Transactional
    public void updateImage(String userId, MultipartFile file) {
        validateFile(file);
        Optional<UserImage> userImage = Optional.ofNullable(findUserImageByUserId(userId));
        updateImageBytes(userImage.get(), file);
        userImageRepository.save(userImage.get());
    }

    @Override
    public MultipartFile getImage(String userId) {
        return null;
    }

    /**
     * Deletes the image associated with a given user.
     *
     * @param userId the unique identifier of the user whose image needs to be deleted
     */
    @Override
    @Transactional
    public void deleteImage(String userId) {
        UserImage userImage = findUserImageByUserId(userId);
        userImageRepository.delete(userImage);
    }

    /**
     * Fetches the image associated with the specified user ID.
     * If no image is found for the given user ID, a ResourceNotFoundException is thrown.
     *
     * @param userId the unique identifier of the user whose image is being fetched
     * @return an Optional containing the UserImage if it exists, otherwise an empty Optional
     * @throws ResourceNotFoundException if no image is found for the specified user ID
     */
    private UserImage findUserImageByUserId(String userId) {
        return userImageRepository.findImageByUid(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User image not found for user ID: " + userId));
    }

    /**
     * Validates the specified file to ensure it meets the required criteria.
     * The validation checks include:
     * - Ensuring the file is not null or empty.
     * - Verifying the file size does not exceed the defined maximum limit.
     *
     * @param file the file to validate; must not be null or empty, and its size must not exceed 5 MB
     * @throws InvalidFileException if the file is null, empty, or its size exceeds the allowed limit
     */
    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("File is empty or null.");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new InvalidFileException("File size exceeds the maximum limit of 5 MB.");
        }
        // Additional validation for file types can also be added
    }

    /**
     * Creates a new UserImage object and associates it with the specified user ID.
     *
     * @param userId the unique identifier of the user for whom the UserImage is being created
     * @return a new UserImage object with the user ID set
     */
    private UserImage createNewUserImage(String userId) {
        UserImage userImage = new UserImage();
        userImage.setUid(userId);
        return userImage;
    }

    /**
     * Updates the image bytes for a given UserImage object using the provided MultipartFile.
     * If the operation encounters an IOException while reading the file content, a RuntimeException will be thrown.
     *
     * @param userImage the UserImage object to update; must not be null
     * @param file      the MultipartFile containing the new image bytes; must not be null and must contain readable data
     * @throws RuntimeException if an IOException occurs while reading the file content
     */
    private void updateImageBytes(UserImage userImage, MultipartFile file) {
        try {
            userImage.setImage(file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("Failed to read image bytes for user ID: " + userImage.getUid(), e);
        }
    }

}
