package com.project.Gateway.dto.userLogin;

import lombok.Data;
import lombok.Builder;

/**
 * Data Transfer Object (DTO) representing the user's login details.
 * This class is primarily utilized for transferring input data during the
 * authentication process.
 * </p> <p>
 * Role: <br>
 * - Acts as the input structure for user login services. <br>
 * - Encapsulates the required data elements for user verification. <br>
 * - Provides methods for validation and manipulation of login-specific fields <br>
 *   via Lombok's annotations.
 * </p> <p>
 * Fields: <br>
 * - username: Represents the username of the user, an optional identifier during login. <br>
 * - email: The email address used for authentication purposes. <br>
 * - password: The password provided by the user, intended for secure validation. <br>
 * </p>
 * This DTO ensures data consistency by encapsulating critical fields required for
 * the login functionality while abstracting away unnecessary complexities.
 */
@Data
@Builder
public class LoginDTO {

    private String username;

    private String email;

    private String password;
    
    

}
