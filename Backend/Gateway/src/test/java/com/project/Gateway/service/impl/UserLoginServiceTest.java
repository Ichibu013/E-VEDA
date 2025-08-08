package com.project.Gateway.service.impl;

import com.project.Gateway.domain.entity.UserLogin;
import com.project.Gateway.dto.request.userLogin.RequestRegisterDTO;
import com.project.Gateway.dto.request.userLogin.RequestLoginDTO;
import com.project.Gateway.dto.response.userLogin.ResponseRegisterDTO;
import com.project.Gateway.repository.IUserRepository;
import com.project.Gateway.service.validator.UserValidator;
import com.project.common.common.exceptions.RegistrationFailedException;
import com.project.common.common.utils.GenericResponseFactory;
import com.project.common.dto.response.AuthResponse;
import com.project.common.dto.response.GenericResponse;
import com.project.common.mapping.GenericDtoMapper;
import com.project.common.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Locale;
import java.util.Set;

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

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldRegisterUserSuccessfully() {
        // Arrange
        RequestRegisterDTO testUser = validRequestRegisterDTO();
        UserLogin mockUserLogin = new UserLogin();
        UserLogin savedUser = UserLogin.builder()
                .username(testUser.getUsername())
                .email(testUser.getEmail())
                .build();
        ResponseRegisterDTO savedResponse = validResponseRegisterDTO();

        // Mocking validators and repository behavior
        when(userValidator.isValidRegisterDTO(testUser)).thenReturn(true);
        when(userValidator.populateUserWithValues(testUser)).thenReturn(mockUserLogin);
        when(userRepository.save(mockUserLogin)).thenReturn(savedUser);
        when(mapper.map(savedUser, ResponseRegisterDTO.class)).thenReturn(savedResponse);

        // Mock success message for generic response
        when(messageSource.getMessage("user.registration.success", null, Locale.getDefault()))
                .thenReturn("Registration successful");

        // Mocking generic response factory
        GenericResponse<ResponseRegisterDTO> mockedResponse = new GenericResponse<>(
                HttpStatus.CREATED, savedResponse, "Registration successful", messageSource
        );
        when(genericResponseFactory.successResponse(HttpStatus.CREATED, savedResponse, "user.registration.success",
                "Registration successful")).thenReturn(mockedResponse);

        // Act
        GenericResponse<ResponseRegisterDTO> response = userLoginService.register(testUser);

        // Assert
        assertNotNull(response, "GenericResponse should not be null");
        assertTrue(response.getSuccess(), "Success flag should be true");
        assertEquals(HttpStatus.CREATED, response.getHttpStatus(), "HTTP status should be CREATED");
        assertEquals(savedResponse, response.getData(), "Response data should match the mocked response");

        verify(userValidator).isValidRegisterDTO(testUser);
        verify(userValidator).populateUserWithValues(testUser);
        verify(userRepository).save(mockUserLogin);
        verify(genericResponseFactory).successResponse(HttpStatus.CREATED, savedResponse, "user.registration.success",
                "Registration successful");
    }

    @Test
    void shouldThrowExceptionWhenRegisterDTOValidationFails() {
        // Arrange
        RequestRegisterDTO invalidRequest = RequestRegisterDTO.builder()
                .username("TestUser")                  // Valid username
                .email("testuser@example.com")         // Valid email format
                .password("validPassword@123")         // Valid password
                .confirmPassword("differentPassword")  // Invalid: does not match password
                .build();

        // Mock to return false for validation failure
        when(userValidator.isValidRegisterDTO(invalidRequest)).thenReturn(false);

        // Act & Assert
        assertThrows(RegistrationFailedException.class, () -> userLoginService.register(invalidRequest));

        // Verify interactions
        verify(userValidator).isValidRegisterDTO(invalidRequest); // Ensure validator is called
        verifyNoInteractions(userRepository, mapper, genericResponseFactory); // Ensure no downstream interactions
    }

    @Test
    void shouldThrowExceptionWhenRepositoryThrowsException() {
        // Arrange
        RequestRegisterDTO userRequest = validRequestRegisterDTO();
        UserLogin userLogin = new UserLogin();

        when(userValidator.isValidRegisterDTO(userRequest)).thenReturn(true);
        when(userValidator.populateUserWithValues(userRequest)).thenReturn(userLogin);
        when(userRepository.save(userLogin)).thenThrow(new RuntimeException("Database error"));

        // Act & Assert
        assertThrows(RegistrationFailedException.class, () -> userLoginService.register(userRequest));

        verify(userValidator).isValidRegisterDTO(userRequest);
        verify(userValidator).populateUserWithValues(userRequest);
        verify(userRepository).save(userLogin);
        verifyNoInteractions(mapper, genericResponseFactory);
    }

    @Test
    void shouldAuthenticateUserSuccessfully() {
        // Arrange
        RequestLoginDTO loginDTO = validRequestLoginDTO();
        String jwtToken = "dummy.jwt.token";
        Set<String> roles = Set.of("ROLE_USER");

        UserDetails userDetails = new User(loginDTO.getEmail(), loginDTO.getPassword(), Set.of());
        when(userDetailsService.loadUserByUsername(loginDTO.getEmail())).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn(jwtToken);

        // Act
        AuthResponse response = userLoginService.authenticate(loginDTO);

        // Assert
        assertNotNull(response, "Response should not be null");
        assertEquals(jwtToken, response.getToken());

        verify(userDetailsService).loadUserByUsername(loginDTO.getEmail());
        verify(jwtService).generateToken(userDetails);
    }

    @Test
    void shouldThrowExceptionForInvalidCredentials() {
        // Arrange
        RequestLoginDTO invalidLogin = invalidRequestLoginDTO();
        doThrow(RuntimeException.class).when(authenticationManager)
                .authenticate(any(UsernamePasswordAuthenticationToken.class));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> userLoginService.authenticate(invalidLogin));

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verifyNoInteractions(userDetailsService, jwtService);
    }

    // Helper methods for reusable test data
    private RequestRegisterDTO validRequestRegisterDTO() {
        return RequestRegisterDTO.builder()
                .username("TestUser")
                .email("testuser@example.com")
                .password("Password@123")
                .confirmPassword("Password@123")
                .build();
    }

    private RequestRegisterDTO invalidRequestRegisterDTO() {
        return RequestRegisterDTO.builder()
                .username("")
                .email("")
                .password("")
                .confirmPassword("")
                .build();
    }

    private ResponseRegisterDTO validResponseRegisterDTO() {
        return ResponseRegisterDTO.builder()
                .username("TestUser")
                .email("testuser@example.com")
                .build();
    }

    private RequestLoginDTO validRequestLoginDTO() {
        return RequestLoginDTO.builder()
                .email("valid@example.com")
                .password("ValidPassword@123")
                .build();
    }

    private RequestLoginDTO invalidRequestLoginDTO() {
        return RequestLoginDTO.builder()
                .email("invalid@example.com")
                .password("InvalidPass")
                .build();
    }
}