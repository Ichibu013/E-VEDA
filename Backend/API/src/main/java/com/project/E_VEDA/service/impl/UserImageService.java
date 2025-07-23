package com.project.E_VEDA.service.impl;

import com.project.E_VEDA.common.exceptions.InvalidFileException;
import com.project.E_VEDA.common.exceptions.ResourceNotFoundException;
import com.project.E_VEDA.common.utils.GenericResponseFactory;
import com.project.E_VEDA.domain.entity.FullUserDetails;
import com.project.E_VEDA.domain.entity.UserImage;
import com.project.E_VEDA.dto.response.GenericResponse;
import com.project.E_VEDA.mapping.GenericDtoMapper;
import com.project.E_VEDA.repository.IUserDetailsRepository;
import com.project.E_VEDA.repository.IUserImageRepository;
import com.project.E_VEDA.service.interfaces.IUserImageService;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

/**
 * UserImageService is a service class responsible for managing user image operations,
 * including uploading, updating, retrieving, and deleting user images. It extends the
 * BaseService class and implements the IUserImageService interface.
 * <p>
 * Responsibilities: <br>
 * - Validate and handle image upload for a specific user. <br>
 * - Update the existing image for a user. <br>
 * - Retrieve a user's image. <br>
 * - Delete a user's image. <br>
 * </p> <p>
 * Key Features: <br>
 * - Enforces business rules to validate image files, including file size limitations. <br>
 * - Handles scenarios where no image exists for a user by creating a new UserImage entity. <br>
 * - Provides transactional support for data persistence operations. <br>
 * </p> <p>
 * Dependencies: <br>
 * - IUserImageRepository: Manages fine-grained database operations for UserImage entities. <br>
 * - IUserDetailsRepository: Fetches user-related details from the database. <br>
 * - GenericResponseFactory: Constructs standardized response objects. <br>
 * - GenericDtoMapper: Maps DTOs to entities and vice versa. <br>
 * </p> <p>
 * Exception Handling: <br>
 * - Throws InvalidFileException for invalid file uploads (e.g., empty file, file size exceeding limits). <br>
 * - Throws ResourceNotFoundException when no image is found for a given user ID. <br>
 * - Handles IOExceptions during file processing and wraps them in a runtime exception. <br>
 * </p>
 * Constants: <br>
 * - MAX_FILE_SIZE: Specifies the maximum allowed file size for uploads (5 MB). <br>
 */
@Service("userImageService")
public class UserImageService extends BaseService implements IUserImageService {

    private static final long MAX_FILE_SIZE = 1024 * 1024 * 5;
    private final IUserImageRepository userImageRepository;

    protected UserImageService(IUserDetailsRepository userDetailsRepository,
                            GenericResponseFactory genericResponseFactory,
                            GenericDtoMapper mapper,
                            IUserImageRepository userImageRepository) {
        super(userDetailsRepository, genericResponseFactory, mapper);
        this.userImageRepository = userImageRepository;
    }

    /**
     * Uploads an image file for the given user. If the user already has an image uploaded,
     * the existing image will be updated with the new file. If no image exists for the user,
     * a new image*/
    @Override
    @Transactional
    public GenericResponse<MultipartFile> uploadImage(String userId, MultipartFile file) {
        validateFile(file);

        FullUserDetails userDetails = fetchUserDetails(userId);
        UserImage existingUserImage = userImageRepository.findImageByUid(userId)
                .orElseGet(() -> createNewUserImage(userId));

        updateImageBytes(existingUserImage, file);
        userImageRepository.save(existingUserImage);

        return genericResponseFactory.successResponse(
                HttpStatus.OK,
                null,
                "user.image.upload.success"
        );
    }

    /**
     * Updates the image associated with the specified user. If a user image
     * already exists, it is replaced with the provided new image file.
     *
     * @param userId the unique identifier of the user whose image is to be updated
     * @param file the new image file to update; must be a valid non-empty file and within size constraints
     * @throws InvalidFileException if the provided file is null, empty, or exceeds the maximum allowed size
     * @throws ResourceNotFoundException if no existing image is found for the specified user ID
     */
    @Override
    @Transactional
    public void updateImage(String userId, MultipartFile file) {
        validateFile(file);
        Optional<UserImage> userImage = fetchUserImage(userId);
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
        userImageRepository.delete(fetchUserImage(userId));
    }

    /**
     * Fetches the image associated with the specified user ID.
     * If no image is found for the given user ID, a ResourceNotFoundException is thrown.
     *
     * @param userId the unique identifier of the user whose image is being fetched
     * @return an Optional containing the UserImage if it exists, otherwise an empty Optional
     * @throws ResourceNotFoundException if no image is found for the specified user ID
     */
    private Optional<UserImage> fetchUserImage(String userId) {
        return Optional.ofNullable(userImageRepository.findImageByUid(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User image not found for user ID: " + userId)));
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
     * @param file the MultipartFile containing the new image bytes; must not be null and must contain readable data
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
