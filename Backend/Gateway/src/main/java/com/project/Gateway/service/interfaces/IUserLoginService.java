package com.project.Gateway.service.interfaces;

import com.project.Gateway.dto.request.userLogin.RequestLoginDTO;
import com.project.Gateway.dto.request.userLogin.RequestRegisterDTO;
import com.project.Gateway.dto.response.userLogin.ResponseRegisterDTO;
import com.project.common.dto.response.AuthResponse;
import com.project.common.dto.response.GenericResponse;
import org.springframework.stereotype.Service;

/**
 * Service interface for managing user authentication and registration operations.
 * Provides methods for user login and registration processes.
 */
@Service("IUserLoginService")
public interface IUserLoginService {

    GenericResponse<ResponseRegisterDTO> register(RequestRegisterDTO requestRegisterDTO);

    AuthResponse authenticate(RequestLoginDTO loginDTO);

    GenericResponse<String> forgetPassword(String email);

    GenericResponse<String> resetPassword(String token,String password);

}
