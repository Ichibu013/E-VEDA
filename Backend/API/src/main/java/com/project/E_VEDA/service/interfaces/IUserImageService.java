package com.project.E_VEDA.service.interfaces;

import com.project.E_VEDA.dto.response.GenericResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service interface for managing user images.
 * Provides methods to upload, update, retrieve, and delete images associated with a user.
 */
@Service("IUserImageService")
public interface IUserImageService {

    GenericResponse<MultipartFile> uploadImage(String userId, MultipartFile file);

    void updateImage(String userId, MultipartFile file);

    MultipartFile getImage(String userId);

    void deleteImage(String userId);

}
