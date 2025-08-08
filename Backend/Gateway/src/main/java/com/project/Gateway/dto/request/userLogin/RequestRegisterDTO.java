package com.project.Gateway.dto.request.userLogin;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) representing the user's registration details.
 * This class is typically used to transfer user input data during the registration process.
 * </p> <p>
 * Fields:
 * - username: The desired username of the new user.
 * - email: The email address provided by the user, used for authentication and contact purposes.
 * - password: The password chosen by the user, which will later be hashed and stored securely.
 * - confirmPassword: A confirmation of the chosen password to verify consistency.
 * - status: The current status of the registration process or user account.
 * </p> <p>
 * This DTO is used as input for the user registration service and ensures data consistency
 * between the user's input and the application's registration logic.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestRegisterDTO {

    @NotBlank(message = "username.required")
    private String username;

    @NotBlank(message = "email.required")
    private String email;

    @NotBlank(message = "password.required")
    private String password;

    @NotBlank(message = "confirmPassword.required")
    private String confirmPassword;

}
