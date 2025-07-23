package com.project.E_VEDA.service.interfaces;

import com.project.E_VEDA.dto.response.GenericResponse;
import com.project.E_VEDA.dto.userLogin.LoginDTO;
import com.project.E_VEDA.dto.userLogin.RegisterDTO;
import org.springframework.stereotype.Service;

/**
 * Service interface for managing user authentication and registration operations.
 * Provides methods for user login and registration processes.
 */
@Service("IUserLoginService")
public interface IUserLoginService {

    GenericResponse<LoginDTO> login(LoginDTO loginDTO);

    GenericResponse<RegisterDTO> register(RegisterDTO registerDTO);

}
