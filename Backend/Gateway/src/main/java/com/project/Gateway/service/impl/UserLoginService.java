package com.project.Gateway.service.impl;

import com.project.E_VEDA.repository.IUserDetailsRepository;
import com.project.E_VEDA.service.impl.BaseService;
import com.project.Gateway.domain.entity.PasswordResetToken;
import com.project.Gateway.domain.entity.UserLogin;
import com.project.Gateway.dto.request.userLogin.RequestLoginDTO;
import com.project.Gateway.dto.request.userLogin.RequestRegisterDTO;
import com.project.Gateway.dto.response.userLogin.ResponseRegisterDTO;
import com.project.Gateway.repository.IPasswordResetTokenRepository;
import com.project.Gateway.repository.IUserRepository;
import com.project.Gateway.service.interfaces.IUserLoginService;
import com.project.Gateway.service.validator.UserValidator;
import com.project.common.common.exceptions.PassTokenInvalidException;
import com.project.common.common.exceptions.RegistrationFailedException;
import com.project.common.common.utils.GenericResponseFactory;
import com.project.common.dto.response.AuthResponse;
import com.project.common.dto.response.GenericResponse;
import com.project.common.mapping.GenericDtoMapper;
import com.project.common.service.JwtService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;


/**
 * UserLoginService is a service class responsible for managing user authentication and
 * registration processes. It implements the IUserLoginService interface, providing concrete
 * implementations for login and user registration functionalities.
 * <p>
 * Key Responsibilities:
 * - Authenticate users based on email and password through the login method.
 * - Register new users while ensuring email uniqueness and hashing passwords for security.
 * - Utilize a GenericResponseFactory to create consistent and reusable response objects.
 * - Leverage a GenericDtoMapper for mapping between DTOs and entity objects.
 * </p> <p>
 * Dependencies:
 * - IUserRepository: Handles database operations related to the UserLogin entity.
 * - GenericResponseFactory: Provides mechanisms to generate standardized API responses.
 * - GenericDtoMapper: Facilitates mapping between domain models and DTOs.
 * - PasswordEncoder: Used for password encryption and verification.
 * </p> <p>
 * Annotations:
 * - @Slf4j: Includes a logger for logging events related to user login and registration processes.
 * - @Service: Marks this class as a service component in the Spring context, enabling dependency injection.
 * </p> <p>
 * Methods:
 * - login: Authenticates a user based on email and password, returning a success or error response.
 * - register: Registers a new user, enforcing unique email constraints, and hashing passwords.
 * </p> <p>
 * Extends:
 * - BaseService: Inherits foundational mechanisms for generating generic responses and DTO-to-entity mapping.
 * </p> <p>
 * Implements:
 * - IUserLoginService: Ensures conformity to the contract defined in the associated interface.
 */
@Slf4j
@Service("userLoginService")
public class UserLoginService extends BaseService implements IUserLoginService {

    private final IUserRepository userRepository;
    private final UserDetailsServiceImpl userDetailsService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserValidator userValidator;
    private final IPasswordResetTokenRepository passwordResetTokenRepository;
    private final JavaMailSenderImpl mailSender;

    protected UserLoginService(IUserDetailsRepository userDetailsRepository,
                               MessageSource messageSource,
                               GenericResponseFactory genericResponseFactory,
                               GenericDtoMapper mapper,
                               IUserRepository userRepository,
                               UserDetailsServiceImpl userDetailsService,
                               AuthenticationManager authenticationManager,
                               JwtService jwtService,
                               UserValidator userValidator,
                               IPasswordResetTokenRepository passwordResetTokenRepository, JavaMailSenderImpl mailSender) {
        super(userDetailsRepository, messageSource, genericResponseFactory, mapper);
        this.userRepository = userRepository;
        this.userDetailsService = userDetailsService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userValidator = userValidator;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.mailSender = mailSender;
    }

    /**
     * Registers a new user by validating the provided registration details,
     * ensuring email uniqueness, encrypting the password, and saving associated user data
     * like user details and user image into the database.
     *
     * @param requestRegisterDTO contains the user's registration details, such as username, email, password,
     *                           confirm password, and registration status. Used to create a new user.
     * @return a GenericResponse containing the RequestRegisterDTO object for the successfully registered user
     * if registration is successful, otherwise an error response with appropriate status and message.
     */
    @Override
    @Transactional
    public GenericResponse<ResponseRegisterDTO> register(RequestRegisterDTO requestRegisterDTO) {
        if (isEmpty(requestRegisterDTO.getEmail(), requestRegisterDTO.getPassword(), requestRegisterDTO.getConfirmPassword())) {
            log.warn("Fields cannot be empty for registration.");
            throw new RegistrationFailedException("Registration failed.");
        }

        if (!userValidator.isValidRegisterDTO(requestRegisterDTO)) {
            log.warn("Registration failed for user with email {}.", requestRegisterDTO.getEmail());
            throw new RegistrationFailedException("Validation failed for registration data.");
        }

        try {
            UserLogin userToSave = createUserLogin(requestRegisterDTO);

            UserLogin savedUser = userRepository.save(userToSave);
            ResponseRegisterDTO savedResponseRegisterDTO = new ResponseRegisterDTO();
            savedResponseRegisterDTO.setEmail(savedUser.getEmail());
            savedResponseRegisterDTO.setUsername(savedUser.getUsername());
            log.info("User {} registered successfully.", savedResponseRegisterDTO.getEmail());
            return genericResponseFactory.successResponse(
                    HttpStatus.CREATED,
                    savedResponseRegisterDTO,
                    "user.registration.success",
                    messageSource.getMessage("user.registration.success", null, Locale.getDefault())
            );
        } catch (Exception e) {
            log.error("Registration failed for user with email {}.", requestRegisterDTO.getEmail(), e);
            throw new RegistrationFailedException("Registration failed for user with email " + requestRegisterDTO.getEmail() + ".");
        }


    }

    /**
     * Authenticates a user using the provided login credentials and generates a JWT token.
     * Validates the user's email and password through the authentication manager,
     * retrieves user details, and assigns the user roles.
     *
     * @param loginDTO the user's login details, including email and password
     * @return an AuthResponse containing a JWT token and a set of user roles if authentication succeeds
     */
    @Override
    public AuthResponse authenticate(RequestLoginDTO loginDTO) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(loginDTO.getEmail());
        String jwt = jwtService.generateToken(userDetails);

        Set<String> role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        log.info("JWT token generated for user {}.", loginDTO.getEmail());
        return new AuthResponse(jwt, role);
    }

    @Override
    public GenericResponse<String> forgetPassword(String email) {
        userRepository.findByEmail(email).ifPresent(this::createPasswordResetToken);
        log.info("Reset password link sent to user {}.", email);
        return genericResponseFactory.successResponse(HttpStatus.OK,
                "If a user with that email exists, a password reset link has been sent",
                messageSource.getMessage("password.reset.link.sent", null, Locale.getDefault()));
    }

    @Override
    public GenericResponse<String> resetPassword(String token,String password) {
        String validationResult = validatePasswordResetToken(token);
        if (validationResult != null) {
            log.warn("Invalid password reset token.");
            throw new PassTokenInvalidException(validationResult);
        }

        PasswordResetToken pasToken = passwordResetTokenRepository.findByToken(token);
        UserLogin user = userRepository.findByEmail(pasToken.getUserLogin().getEmail())
                .orElseThrow();
        user.setPassword(password);
        userRepository.save(user);
        log.info("Password reset successfully for user {}.", user.getEmail());
        passwordResetTokenRepository.delete(pasToken);
        return genericResponseFactory.successResponse(
                HttpStatus.OK,
                "Password Reset completed successfully",
                messageSource.getMessage("password.reset.success", null, Locale.getDefault())
        );
    }

    private void createPasswordResetToken(UserLogin user) {
        String token = UUID.randomUUID().toString();
        PasswordResetToken myToken = new PasswordResetToken();
        myToken.setToken(token);
        myToken.setUserLogin(user);
        myToken.setExpiryDate(calculateExpiryDate(24 * 60)); // 24 hrs
        passwordResetTokenRepository.save(myToken);

        // Sending email
        SimpleMailMessage emailMessage = new SimpleMailMessage();
        emailMessage.setTo(user.getEmail());
        emailMessage.setSubject("Password reset");
        emailMessage.setText("To Reset your password, please click the following link to reset your password.\n" +
                "https://localhost:8080/password/reset-password?token=" + token);
        emailMessage.setFrom("noreply@e_veda");
        mailSender.send(emailMessage);
    }

    // A method to validate the token
    public String validatePasswordResetToken(String token) {
        PasswordResetToken passToken = passwordResetTokenRepository.findByToken(token);
        if (passToken == null) {
            return "Invalid PassToken";
        }

        Calendar cal = Calendar.getInstance();
        if (passToken.getExpiryDate().before(cal.getTime())) {
            return "PassToken expired";
        }
        return null; // Token is valid
    }

    private UserLogin createUserLogin(RequestRegisterDTO responseRegisterDTO) {
        return userValidator.populateUserWithValues(responseRegisterDTO);
    }

    private boolean isEmpty(String... strings) {
        return strings == null || strings.length == 0 || strings[0] == null || strings[0].isEmpty();
    }

    private Date calculateExpiryDate(int expiryTimeInMinutes) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        calendar.add(Calendar.MINUTE, expiryTimeInMinutes);
        return calendar.getTime();
    }


}
