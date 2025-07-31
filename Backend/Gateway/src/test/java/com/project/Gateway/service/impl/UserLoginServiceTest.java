package com.project.Gateway.service.impl;

import com.project.Gateway.domain.entity.UserLogin;
import com.project.Gateway.dto.userLogin.LoginDTO;
import com.project.Gateway.dto.userLogin.RegisterDTO;
import com.project.Gateway.repository.IUserRepository;
import com.project.Gateway.service.validator.UserValidator;
import com.project.common.common.exceptions.RegistrationFailedException;
import com.project.common.common.utils.GenericResponseFactory;
import com.project.common.dto.response.AuthResponse;
import com.project.common.dto.response.GenericResponse;
import com.project.common.mapping.GenericDtoMapper;
import com.project.common.service.JwtService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserLoginServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserDetailsServiceImpl userDetailsService;

    @Mock
    private JwtService jwtService;

    @Mock
    private IUserRepository userRepository;

    @Mock
    private MessageSource messageSource;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserValidator userValidator;

    @Mock
    private GenericDtoMapper mapper;

    @Mock
    private GenericResponseFactory genericResponseFactory;

    @InjectMocks
    private UserLoginService userLoginService;

    public UserLoginServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldRegisterUserSuccessfully() {
        // Arrange
        RegisterDTO registerDTO = RegisterDTO.builder()
                .username("TestUser")
                .email("testuser@example.com")
                .password("strongPassword@123")
                .confirmPassword("strongPassword@123")
                .build();

        UserLogin userLogin = new UserLogin();
        UserLogin savedUser = new UserLogin();
        RegisterDTO savedRegisterDTO = new RegisterDTO();

        when(userValidator.isValidRegisterDTO(registerDTO)).thenReturn(true);
        when(userValidator.populateUserWithValues(registerDTO)).thenReturn(userLogin);
        when(userRepository.save(userLogin)).thenReturn(savedUser);
        when(mapper.map(savedUser, RegisterDTO.class)).thenReturn(savedRegisterDTO);

        when(messageSource.getMessage("user.registration.success", null, Locale.getDefault())).thenReturn("Registration successful");

        GenericResponse<RegisterDTO> mockedResponse =
                new GenericResponse<>(HttpStatus.CREATED, savedRegisterDTO, "Registration successful", messageSource);

        when(genericResponseFactory.successResponse(HttpStatus.CREATED, savedRegisterDTO, "user.registration.success", "Registration successful"))
                .thenReturn(mockedResponse);

        // Act
        GenericResponse<RegisterDTO> response = userLoginService.register(registerDTO);

        // Assert
        assertNotNull(response);
        assertTrue(response.getSuccess());
        assertEquals(HttpStatus.CREATED, response.getHttpStatus());
        assertEquals(savedRegisterDTO, response.getData());

        verify(userValidator).isValidRegisterDTO(registerDTO);
        verify(userValidator).populateUserWithValues(registerDTO);
        verify(userRepository).save(userLogin);
        verify(genericResponseFactory).successResponse(HttpStatus.CREATED, savedRegisterDTO, "user.registration.success", "Registration successful");
    }

    @Test
    void shouldThrowExceptionWhenRegisterDTOValidationFails() {
        RegisterDTO registerDTO = RegisterDTO.builder()
                .username("TestUser")
                .email("testuser@example.com")
                .password("strongpassword")
                .confirmPassword("mismatchedpassword")
                .build();

        when(userValidator.isValidRegisterDTO(registerDTO)).thenReturn(false);

        assertThrows(RegistrationFailedException.class, () -> userLoginService.register(registerDTO));

        verify(userValidator).isValidRegisterDTO(registerDTO);
        verifyNoInteractions(userRepository, mapper, genericResponseFactory);
    }

    @Test
    void shouldThrowExceptionWhenRepositoryThrowsException() {
        RegisterDTO registerDTO = RegisterDTO.builder()
                .username("TestUser")
                .email("testuser@example.com")
                .password("strongpassword")
                .confirmPassword("strongpassword")
                .build();

        UserLogin userLogin = new UserLogin();

        when(userValidator.isValidRegisterDTO(registerDTO)).thenReturn(true);
        when(userValidator.populateUserWithValues(registerDTO)).thenReturn(userLogin);
        when(userRepository.save(userLogin)).thenThrow(new RuntimeException("Database error"));

        assertThrows(RegistrationFailedException.class, () -> userLoginService.register(registerDTO));

        verify(userValidator).isValidRegisterDTO(registerDTO);
        verify(userValidator).populateUserWithValues(registerDTO);
        verify(userRepository).save(userLogin);
        verifyNoInteractions(mapper, genericResponseFactory);
    }

    @Test
    void shouldThrowConstraintViolationExceptionForInvalidData() {
        RegisterDTO registerDTO = RegisterDTO.builder()
                .username("")
                .email("")
                .password("")
                .confirmPassword("")
                .build();

        assertThrows(RegistrationFailedException.class, () -> userLoginService.register(registerDTO));

        verifyNoInteractions(userValidator, userRepository, mapper, genericResponseFactory);
    }

    @Test
    void shouldAuthenticateUserSuccessfully() {
        // Arrange
        String email = "test@example.com";
        String password = "password";
        String jwtToken = "dummy.jwt.token";
        Set<String> roles = Set.of("ROLE_USER");

        LoginDTO loginDTO = LoginDTO.builder().email(email).password(password).build();

        // Create a real Spring Security UserDetails object to return from the mock
        UserDetails userDetails = new User(email, password,
                roles.stream().map(role -> (GrantedAuthority) () -> role).collect(Collectors.toSet()));

        // Mock the behavior of userDetailsService when loadUserByUsername is called
        when(userDetailsService.loadUserByUsername(email)).thenReturn(userDetails);

        // Mock the behavior of jwtService
        when(jwtService.generateToken(userDetails)).thenReturn(jwtToken);

        // Act
        AuthResponse response = userLoginService.authenticate(loginDTO);

        // Assert
        assertNotNull(response, "Response should not be null");
        assertNotNull(response.getToken(), "Response token should not be null");
        assertEquals(jwtToken, response.getToken());
        assertEquals(roles, response.getRoles());

        // Verify that userDetailsService.loadUserByUsername was called exactly once with the correct email
        verify(userDetailsService, times(1)).loadUserByUsername(email);
        // Verify that jwtService.generateToken was called exactly once with the userDetails
        verify(jwtService, times(1)).generateToken(userDetails);
    }

    @Test
    void shouldThrowExceptionForInvalidCredentials() {
        // Arrange
        LoginDTO loginDTO = LoginDTO.builder()
                .email("invaliduser@example.com")
                .password("wrongPassword")
                .build();

        doThrow(RuntimeException.class).when(authenticationManager)
                .authenticate(any(UsernamePasswordAuthenticationToken.class));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> userLoginService.authenticate(loginDTO));

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verifyNoInteractions(userDetailsService, jwtService);
    }

}
