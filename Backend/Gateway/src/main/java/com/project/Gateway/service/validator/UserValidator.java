package com.project.Gateway.service.validator;

import com.project.Gateway.domain.entity.UserLogin;
import com.project.Gateway.dto.userLogin.RegisterDTO;
import com.project.Gateway.repository.IUserRepository;
import com.project.common.common.emuns.Role;
import com.project.common.common.emuns.Status;
import com.project.common.mapping.GenericDtoMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Slf4j
@Component
public class UserValidator {

    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final GenericDtoMapper mapper;

    protected UserValidator(IUserRepository userRepository,
                            PasswordEncoder passwordEncoder,
                            GenericDtoMapper mapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mapper = mapper;
    }

    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
            "^" +                                           // Start of the string
                    "(?=.*[0-9])" +                                 // At least one digit
                    "(?=.*[a-z])" +                                 // At least one lowercase letter
                    "(?=.*[A-Z])" +                                 // At least one uppercase letter
                    "(?=.*[@#$%^&+=])" +                            // At least one special character
                    "(?=\\S+$)" +                                   // No whitespace allowed
                    ".{8,}" +                                       // Minimum 8 characters
                    "$"                                             // End of the string
    );


    public boolean isValidRegisterDTO(RegisterDTO registerDTO) {
        boolean isEmailValid = isEmailUnique(registerDTO.getEmail());
        boolean isPasswordValid = isPasswordValid(registerDTO.getPassword());
        boolean isPasswordMatching = isPasswordMatching(registerDTO);

        return isEmailValid && isPasswordValid && isPasswordMatching;
    }

    public boolean isEmailUnique(String email) {
        boolean exists = userRepository.findByEmail(email).isPresent();
        if (exists) {
            log.warn("User with email {} already exists.", email);
        }
        return !exists;
    }

    public boolean isPasswordValid(String password) {
        boolean isValid =  PASSWORD_PATTERN.matcher(password).matches();
        if (!isValid) {
            log.warn("Password provided for user is invalid.");
        }
        return isValid;
    }

    public boolean isPasswordMatching(RegisterDTO registerDTO) {
        boolean matches = registerDTO.getPassword().equals(registerDTO.getConfirmPassword());
        if (!matches) {
            log.warn("Passwords provided for user {} do not match.", registerDTO.getEmail());
        }
        return matches;
    }

    public UserLogin populateUserWithValues(RegisterDTO registerDTO) {
        UserLogin userLogin = mapper.map(registerDTO, UserLogin.class);
        userLogin.setRole(Role.ROLE_USER);
        userLogin.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        userLogin.setStatus(Status.ACTIVE);
        userLogin.assignCreatedDate();
        return userLogin;
    }

}
