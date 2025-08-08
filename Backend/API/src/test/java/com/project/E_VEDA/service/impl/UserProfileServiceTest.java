package com.project.E_VEDA.service.impl;

import com.project.E_VEDA.domain.entity.FullUserDetails;
import com.project.E_VEDA.dto.fullUserDetails.ProfileDTO;
import com.project.E_VEDA.repository.IUserDetailsRepository;
import com.project.common.common.exceptions.NoUserProfileException;
import com.project.common.common.utils.GenericResponseFactory;
import com.project.common.dto.response.GenericResponse;
import com.project.common.mapping.GenericDtoMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;

import java.util.Locale;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserProfileServiceTest {

    @InjectMocks
    private UserProfileService userProfileService;

    @Mock
    private IUserDetailsRepository userDetailsRepository;

    @Mock
    private GenericResponseFactory genericResponseFactory;

    @Mock
    private GenericDtoMapper mapper;

    @Mock
    private MessageSource messageSource;

    private String messageSuccessKey = "user.profile.success";
    private String messageErrorKey = "user.profile.not.found";

    @BeforeEach
    void setUp() {
        Locale.setDefault(Locale.ENGLISH);
    }

    @Test
    void testGetProfile_UserExists() {
        // Arrange
        String userId = "12345";
        FullUserDetails userDetails = new FullUserDetails();
        userDetails.setUid(userId);
        ProfileDTO profileDTO = ProfileDTO.builder()
                .name("John Doe")
                .dob("1990-01-01")
                .address("123 Fake Street")
                .phone(1234567890)
                .gender("Male")
                .build();
        GenericResponse<ProfileDTO> expectedResponse = GenericResponse.<ProfileDTO>builder()
                .httpStatus(HttpStatus.OK)
                .data(profileDTO)
                .message(messageSuccessKey)
                .success(true)
                .build();

        when(userDetailsRepository.findById(userId)).thenReturn(Optional.of(userDetails));
        when(mapper.map(userDetails, ProfileDTO.class)).thenReturn(profileDTO);
        when(genericResponseFactory.successResponse(HttpStatus.OK, profileDTO, messageSuccessKey, messageSource))
                .thenReturn(expectedResponse);

        // Act
        GenericResponse<ProfileDTO> actualResponse = userProfileService.getProfile(userId);

        // Assert
        assertNotNull(actualResponse);
        assertEquals(expectedResponse, actualResponse);
        verify(userDetailsRepository, times(1)).findById(userId);
        verify(mapper, times(1)).map(userDetails, ProfileDTO.class);
        verify(genericResponseFactory, times(1)).successResponse(HttpStatus.OK, profileDTO, messageSuccessKey, messageSource);
    }

    @Test
    void testGetProfile_UserDoesNotExist() {
        // Arrange
        String userId = "99999";
        when(userDetailsRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        NoUserProfileException exception = assertThrows(NoUserProfileException.class,
                () -> userProfileService.getProfile(userId));

        assertEquals("No User with ID 99999 found. Please check the user ID and try again.", exception.getMessage());
        verify(userDetailsRepository, times(1)).findById(userId);
        verifyNoInteractions(mapper, genericResponseFactory);
    }

    @Test
    void testCreateAndUpdateProfile_NewProfile() {
        // Arrange
        String userId = "12345";
        ProfileDTO profileDTO = ProfileDTO.builder()
                .name("John Doe")
                .dob("1990-01-01")
                .address("123 Fake Street")
                .phone(1234567890)
                .gender("Male")
                .build();
        FullUserDetails userDetails = new FullUserDetails();
        userDetails.setUid(userId);
        FullUserDetails newUserDetails = new FullUserDetails();
        GenericResponse<ProfileDTO> expectedResponse = GenericResponse.<ProfileDTO>builder()
                .httpStatus(HttpStatus.OK)
                .data(profileDTO)
                .message(messageSuccessKey)
                .success(true)
                .build();

        when(userDetailsRepository.findById(userId)).thenReturn(Optional.empty());
        when(mapper.map(profileDTO, FullUserDetails.class)).thenReturn(newUserDetails);
        when(userDetailsRepository.save(newUserDetails)).thenReturn(newUserDetails);
        when(mapper.map(newUserDetails, ProfileDTO.class)).thenReturn(profileDTO);
        when(genericResponseFactory.successResponse(HttpStatus.OK, profileDTO, messageSuccessKey, messageSource))
                .thenReturn(expectedResponse);

        // Act
        GenericResponse<ProfileDTO> actualResponse = userProfileService.createAndUpdateProfile(userId, profileDTO);

        // Assert
        assertNotNull(actualResponse);
        assertEquals(expectedResponse, actualResponse);
        verify(userDetailsRepository, times(1)).findById(userId);
        verify(userDetailsRepository, times(1)).save(newUserDetails);
        verify(mapper, times(1)).map(profileDTO, FullUserDetails.class);
        verify(mapper, times(1)).map(newUserDetails, ProfileDTO.class);
    }

    @Test
    void testDeleteProfile_UserExists() {
        // Arrange
        String userId = "12345";
        FullUserDetails userDetails = new FullUserDetails();
        userDetails.setUid(userId);

        when(userDetailsRepository.findById(userId)).thenReturn(Optional.of(userDetails));
        when(genericResponseFactory.successResponse(
                HttpStatus.OK,
                null,
                "user.profile.delete.success",
                messageSource))
                .thenReturn(GenericResponse
                        .builder()
                        .httpStatus(HttpStatus.OK)
                        .data(null)
                        .message("user.profile.delete.success")
                        .success(true)
                        .build());

        // Act
        GenericResponse<ProfileDTO> response = userProfileService.deleteProfile(userId);

        // Assert
        assertNotNull(response, "The response should not be null.");
        assertNull(response.getData(), "The response data should be null.");
        assertTrue(response.getSuccess(), "The success flag should be true.");
        assertEquals("user.profile.delete.success", response.getMessage(), "The message should match the expected value.");
        verify(userDetailsRepository, times(1)).findById(userId);
        verify(userDetailsRepository, times(1)).deleteById(userId);
        verify(genericResponseFactory, times(1)).successResponse(
                HttpStatus.OK,
                null,
                "user.profile.delete.success",
                messageSource
        );
        verifyNoMoreInteractions(userDetailsRepository, genericResponseFactory);
    }
    @Test
    void testDeleteProfile_UserDoesNotExist() {
        // Arrange
        String userId = "99999";
        when(userDetailsRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        NoUserProfileException exception = assertThrows(NoUserProfileException.class,
                () -> userProfileService.deleteProfile(userId));

        assertEquals("No User profile found for user ID 99999. Please check the user ID and try again.", exception.getMessage());
        verify(userDetailsRepository, times(1)).findById(userId);
        verifyNoMoreInteractions(userDetailsRepository);
    }
}