package com.project.Gateway;

import com.project.Gateway.domain.entity.UserLogin;
import com.project.Gateway.dto.userLogin.LoginDTO;
import com.project.Gateway.dto.userLogin.RegisterDTO;
import com.project.Gateway.repository.IUserRepository;
import com.project.Gateway.service.impl.UserDetailsServiceImpl;
import com.project.Gateway.service.impl.UserLoginService;
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
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;


public class UserLoginServiceTest {

    @Mock
    private IUserRepository userRepository;

    @Mock
    private GenericResponseFactory genericResponseFactory;

    @Mock
    private GenericDtoMapper mapper;

    @Mock
    private MessageSource messageSource;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserLoginService userLoginService;

    @Mock
    private JwtService jwtService;

    @Mock
    private UserDetailsServiceImpl userDetailsService;

    private BCryptPasswordEncoder realPasswordEncoder;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this); // Initializes all @Mock and @InjectMocks fields

        realPasswordEncoder = new BCryptPasswordEncoder();

        // Mock behaviour of message source for all message keys
        when(messageSource.getMessage(eq("user.login.failed"), any(Object[].class), any(Locale.class))).thenReturn("user.login.failed");
        when(messageSource.getMessage(eq("user.already.exists"), any(Object[].class), any(Locale.class))).thenReturn("user.already.exists");
        when(messageSource.getMessage(eq("user.registration.success"), any(Object[].class), any(Locale.class))).thenReturn("user.registration.success");
        when(messageSource.getMessage(eq("user.login.success"), any(Object[].class), any(Locale.class))).thenReturn("user.login.success");
        when(messageSource.getMessage(eq("user.profile.not.found"), any(Object[].class), any(Locale.class))).thenReturn("user.profile.not.found");
        when(messageSource.getMessage(eq("user.profile.success"), any(Object[].class), any(Locale.class))).thenReturn("user.profile.success");
        when(messageSource.getMessage(eq("user.profile.update.success"), any(Object[].class), any(Locale.class))).thenReturn("user.profile.update.success");
        when(messageSource.getMessage(eq("user.profile.delete.success"), any(Object[].class), any(Locale.class))).thenReturn("user.profile.delete.success");
        when(messageSource.getMessage(eq("user.profile.update.failed"), any(Object[].class), any(Locale.class))).thenReturn("user.profile.update.failed");
    }

    @Test
    public void testLogin_Successful() {
        // Arrange
        String email = "test@example.com";
        String rawPassword = "password";
        String encodedPassword = realPasswordEncoder.encode(rawPassword); // Use the real encoder for test data setup
        String successMessageKey = "user.login.success";
        String resolvedMessage = "user.login.success";

        LoginDTO loginDTO = LoginDTO.builder().email(email).password(rawPassword).build();
        UserLogin userLogin = new UserLogin();
        userLogin.setEmail(email);
        userLogin.setPassword(encodedPassword);

        // Mock behavior *before* calling the service method
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(userLogin));
        // Mock passwordEncoder.matches() for successful login
        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(true);
        when(mapper.map(userLogin, LoginDTO.class)).thenReturn(loginDTO);

        when(genericResponseFactory.successResponse(eq(HttpStatus.OK), eq(loginDTO), eq(successMessageKey))).thenReturn(GenericResponse.<LoginDTO>builder().httpStatus(HttpStatus.OK).data(loginDTO).message(resolvedMessage).success(true).build());

        // Act
        GenericResponse<LoginDTO> response = userLoginService.login(loginDTO);

        // Assert
        assertNotNull(response, "Response should not be null"); // Added null check for robustness
        assertEquals(HttpStatus.OK, response.getHttpStatus());
        assertEquals(resolvedMessage, response.getMessage());
        assertEquals(loginDTO, response.getData());
        assertTrue(response.getSuccess()); // Use assertTrue for boolean
    }

    @Test
    public void shouldReturnNotFoundWhenPasswordIsInvalid() {
        // Constants
        final String EMAIL = "test@example.com";
        final String INVALID_PASSWORD = "wrongPassword";
        final String VALID_PASSWORD = "password";
        final String ERROR_MESSAGE = "user.login.failed";
        final String RESOLVED_ERROR_MESSAGE = "user.login.failed";

        // Arrange
        LoginDTO loginDTO = LoginDTO.builder().email(EMAIL).password(INVALID_PASSWORD).build();
        UserLogin userLogin = createUserLogin(EMAIL, VALID_PASSWORD); // This uses realPasswordEncoder

        // Mock behavior *before* calling the service method
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(userLogin));
        // Mock passwordEncoder.matches() for invalid password scenario
        when(passwordEncoder.matches(INVALID_PASSWORD, userLogin.getPassword())).thenReturn(false);

        when(genericResponseFactory.errorResponse(eq(HttpStatus.NOT_FOUND), any(), eq(ERROR_MESSAGE))).thenReturn(GenericResponse.builder().httpStatus(HttpStatus.NOT_FOUND).data(null).message(RESOLVED_ERROR_MESSAGE).success(false).build());

        // Act
        GenericResponse<LoginDTO> response = userLoginService.login(loginDTO);

        // Assert
        assertNotNull(response, "Response should not be null"); // Added null check for robustness
        assertResponse(response, HttpStatus.NOT_FOUND, RESOLVED_ERROR_MESSAGE, null, false);
    }

    private UserLogin createUserLogin(String email, String password) {
        UserLogin userLogin = new UserLogin();
        userLogin.setEmail(email);
        // Use the realPasswordEncoder to encode the password for the test UserLogin object
        userLogin.setPassword(realPasswordEncoder.encode(password));
        return userLogin;
    }

    private void assertResponse(GenericResponse<LoginDTO> response, HttpStatus status, String message, LoginDTO data, boolean success) {
        assertEquals(status, response.getHttpStatus());
        assertEquals(message, response.getMessage());
        assertEquals(success, response.getSuccess());
        assertEquals(data, response.getData());
    }

    @Test
    public void testLogin_Failure_UserNotFound() {
        // Arrange
        String email = "test@example.com";
        String password = "password";
        String errorMessageKey = "user.login.failed";
        String resolvedErrorMessage = "user.login.failed";
        LoginDTO loginDTO = LoginDTO.builder().email(email).password(password).build();

        // Mock userRepository to return empty Optional
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Mock passwordEncoder.matches() behavior.
        // Even if user is not found, the filter might still be evaluated.
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false); // Default to false for failure cases

        when(genericResponseFactory.errorResponse(eq(HttpStatus.NOT_FOUND), any(), // Always use any()
                eq(errorMessageKey))).thenReturn(GenericResponse.builder().httpStatus(HttpStatus.NOT_FOUND).data(null).message(resolvedErrorMessage).success(false).build());

        // Act
        GenericResponse<LoginDTO> response = userLoginService.login(loginDTO);

        // Assert
        assertNotNull(response, "Response should not be null");
        assertEquals(HttpStatus.NOT_FOUND, response.getHttpStatus());
        assertEquals(resolvedErrorMessage, response.getMessage());
        assertFalse(response.getSuccess());
        assertNull(response.getData()); // Use assertNull for clarity
    }

    @Test
    public void testRegister_Successful() {
        // Arrange
        String email = "newuser@example.com";
        String rawPassword = "newPassword";
        String successMessageKey = "user.registration.success";
        String resolvedMessage = "user.registration.success";

        RegisterDTO registerDTO = RegisterDTO.builder().email(email).password(rawPassword).build();

        UserLogin newUser = new UserLogin();
        newUser.setEmail(email);
        newUser.setPassword(rawPassword);

        // Mock behaviors
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(mapper.map(registerDTO, UserLogin.class)).thenReturn(newUser);
        when(passwordEncoder.encode(rawPassword)).thenReturn("encodedPassword");
        when(userRepository.save(newUser)).thenReturn(newUser);
        when(mapper.map(newUser, RegisterDTO.class)).thenReturn(registerDTO);

        when(genericResponseFactory.successResponse(eq(HttpStatus.CREATED), eq(registerDTO), eq(successMessageKey))).thenReturn(GenericResponse.<RegisterDTO>builder().httpStatus(HttpStatus.CREATED).data(registerDTO).message(resolvedMessage).success(true).build());

        // Act
        GenericResponse<RegisterDTO> response = userLoginService.register(registerDTO);

        // Assert
        assertNotNull(response, "Response should not be null");
        assertEquals(HttpStatus.CREATED, response.getHttpStatus());
        assertEquals(resolvedMessage, response.getMessage());
        assertEquals(registerDTO, response.getData());
        assertTrue(response.getSuccess());
    }

    @Test
    public void testRegister_UserAlreadyExists() {
        // Arrange
        String email = "existinguser@example.com";
        String rawPassword = "somePassword";
        String errorMessageKey = "user.already.exists";
        String resolvedMessage = "user.already.exists";

        RegisterDTO registerDTO = RegisterDTO.builder().email(email).password(rawPassword).build();

        UserLogin existingUser = new UserLogin();
        existingUser.setEmail(email);
        existingUser.setPassword("encodedPassword");

        // Mock behaviors
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(existingUser));

        when(genericResponseFactory.errorResponse(eq(HttpStatus.FOUND), eq(Map.of("Email", email)), eq(errorMessageKey))).thenReturn(GenericResponse.builder().httpStatus(HttpStatus.FOUND).data(null).message(resolvedMessage).success(false).build());

        // Act
        GenericResponse<RegisterDTO> response = userLoginService.register(registerDTO);

        // Assert
        assertNotNull(response, "Response should not be null");
        assertEquals(HttpStatus.FOUND, response.getHttpStatus());
        assertEquals(resolvedMessage, response.getMessage());
        assertFalse(response.getSuccess());
        assertNull(response.getData());
    }

    @Test
    public void testAuthenticate_Successful() {
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
    public void testAuthenticate_InvalidCredentials() {
        // Arrange
        String email = "invalid@example.com";
        String password = "wrongpassword";

        LoginDTO loginDTO = LoginDTO.builder().email(email).password(password).build();

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new org.springframework.security.core.AuthenticationException("Bad credentials") {
                });

        // Act & Assert
        org.springframework.security.core.AuthenticationException exception = assertThrows(
                org.springframework.security.core.AuthenticationException.class,
                () -> userLoginService.authenticate(loginDTO)
        );
        assertEquals("Bad credentials", exception.getMessage());
    }
}