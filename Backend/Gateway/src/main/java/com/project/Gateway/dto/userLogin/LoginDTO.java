package com.project.Gateway.dto.userLogin;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;

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
@NoArgsConstructor
@AllArgsConstructor
public class LoginDTO {

    @NotBlank(message = "username.required")
    private String username;

    @NotBlank(message = "email.required")
    @Email(message = "email.invalid")
    private String email;

    @NotBlank(message = "password.required")
    private String password;
    
    

}
