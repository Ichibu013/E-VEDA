package com.project.Gateway.service.interfaces;

import com.project.common.dto.response.AuthResponse;
import com.project.common.dto.response.GenericResponse;
import com.project.Gateway.dto.userLogin.LoginDTO;
import com.project.Gateway.dto.userLogin.RegisterDTO;
import org.springframework.stereotype.Service;

/**
 * Service interface for managing user authentication and registration operations.
 * Provides methods for user login and registration processes.
 */
@Service("IUserLoginService")
public interface IUserLoginService {

    GenericResponse<LoginDTO> login(LoginDTO loginDTO);

    GenericResponse<RegisterDTO> register(RegisterDTO registerDTO);

    AuthResponse authenticate(LoginDTO loginDTO);

}
