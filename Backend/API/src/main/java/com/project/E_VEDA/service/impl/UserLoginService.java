package com.project.E_VEDA.service.impl;

import com.project.E_VEDA.common.utils.GenericResponseFactory;
import com.project.E_VEDA.domain.entity.UserLogin;
import com.project.E_VEDA.dto.response.GenericResponse;
import com.project.E_VEDA.dto.userLogin.LoginDTO;
import com.project.E_VEDA.dto.userLogin.RegisterDTO;
import com.project.E_VEDA.mapping.GenericDtoMapper;
import com.project.E_VEDA.repository.IUserDetailsRepository;
import com.project.E_VEDA.repository.IUserRepository;
import com.project.E_VEDA.service.interfaces.IUserLoginService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

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

    private final PasswordEncoder passwordEncoder=new BCryptPasswordEncoder();

    protected UserLoginService(IUserDetailsRepository userDetailsRepository,
                            GenericResponseFactory genericResponseFactory,
                            GenericDtoMapper mapper,
                            IUserRepository userRepository) {
        super(userDetailsRepository, genericResponseFactory, mapper);
        this.userRepository = userRepository;
    }

    /**
     * Authenticates a user based on the provided login credentials.
     * Validates the user's email and password, returning a response indicating
     * success or failure of the login attempt.
     *
     * @param loginDTO contains the user's login details such as email and password
     * @return a GenericResponse containing the LoginDTO object if authentication succeeds,
     *         otherwise an error response with appropriate status and message
     */
    @Override
    @Transactional
    public GenericResponse<LoginDTO> login(LoginDTO loginDTO) {
        Optional<UserLogin> user = userRepository.findByEmail(loginDTO.getEmail())
                .filter(u -> passwordEncoder.matches(loginDTO.getPassword(), u.getPassword()));
        if (user.isEmpty()) {
            return genericResponseFactory.errorResponse(HttpStatus.NOT_FOUND, null ,"user.login.failed");
        }
        return genericResponseFactory.successResponse(HttpStatus.OK,
                mapper.map(user.get(), LoginDTO.class),
                "user.login.success");
    }

    /**
     * Registers a new user by validating the provided registration details,
     * ensuring email uniqueness, encrypting the password, and saving associated user data
     * like user details and user image into the database.
     *
     * @param registerDTO contains the user's registration details, such as username, email, password,
     *                    confirm password, and registration status. Used to create a new user.
     * @return a GenericResponse containing the RegisterDTO object for the successfully registered user
     *         if registration is successful, otherwise an error response with appropriate status and message.
     */
    @Override
    @Transactional
    public GenericResponse<RegisterDTO> register(RegisterDTO registerDTO) {
        Optional<UserLogin> existingUser = userRepository.findByEmail(registerDTO.getEmail());
        if (existingUser.isPresent()){
            log.info("User with email {} already exists.", registerDTO.getEmail());
            return genericResponseFactory.errorResponse(HttpStatus.FOUND,
                    Map.of("Email", registerDTO.getEmail()),
                    "user.already.exists");
        }

        final UserLogin usertoSave = mapper.map(registerDTO, UserLogin.class);
        usertoSave.setPassword(passwordEncoder.encode(registerDTO.getPassword()));

/*
        FullUserDetails userDetails = new FullUserDetails();
        userDetails.setUid(usertoSave.getId());
        userDetailsRepository.save(userDetails);

        UserImage userImage = new UserImage();
        userImage.setUserLoginId(usertoSave);
        userImage.setUid(userDetails.getUid());
        userImageRepository.save(userImage);
*/

        final UserLogin savedUser = userRepository.save(usertoSave);
        final RegisterDTO savedRegisterDTO = mapper.map(savedUser, RegisterDTO.class);
        log.info("User {} registered successfully.", savedRegisterDTO.getEmail());
        return genericResponseFactory.successResponse(HttpStatus.CREATED,
                savedRegisterDTO,
                "user.registration.success");

    }
}
