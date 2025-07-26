package com.project.E_VEDA.service.interfaces;

import com.project.E_VEDA.dto.fullUserDetails.ProfileDTO;
import com.project.common.dto.response.GenericResponse;
import org.springframework.stereotype.Service;

/**
 * Service interface for managing the user profile operations.
 * Provides methods to fetch, update, and delete user profile details.
 */
@Service("IFullUserDetailsService")
public interface IFullUserDetailsService {

    GenericResponse<ProfileDTO> getProfile(String userId);

    GenericResponse<ProfileDTO> updateProfile(String userId, ProfileDTO profileDTO);

    GenericResponse<ProfileDTO> deleteProfile(String userId);

}
