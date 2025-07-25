package com.project.E_VEDA.service.impl;

import com.project.E_VEDA.common.utils.GenericResponseFactory;
import com.project.E_VEDA.domain.entity.FullUserDetails;
import com.project.E_VEDA.dto.fullUserDetails.ProfileDTO;
import com.project.E_VEDA.dto.response.GenericResponse;
import com.project.E_VEDA.mapping.GenericDtoMapper;
import com.project.E_VEDA.repository.IUserDetailsRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.Optional;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FullUserServiceServiceTest {

    @InjectMocks
    private FullUserServiceService fullUserServiceService;

    @Mock
    private IUserDetailsRepository userDetailsRepository;

    @Mock
    private GenericResponseFactory genericResponseFactory;

    @Mock
    private GenericDtoMapper mapper;

//    public FullUserServiceServiceTest() {
//        MockitoAnnotations.openMocks(this);
//    }

    @Test
    void testGetProfile_UserExits() {
        // Arrange
        String userId = "12345";
        FullUserDetails userDetails = new FullUserDetails();
        userDetails.setUid(userId);
        String messageKey = "user.profile.success";

        ProfileDTO profileDTO = ProfileDTO.builder()
                .name("<NAME>")
                .address("123 Fake Street, Vancouver, BC")
                .dob("1990-01-01")
                .phone(1234567890)
                .gender("Male")
                .build();
        GenericResponse<ProfileDTO> expectedResponse = new GenericResponse<>();
        expectedResponse.setHttpStatus(HttpStatus.OK);
        expectedResponse.setData(profileDTO);
        expectedResponse.setMessage(messageKey);

        when(userDetailsRepository.findById(userId)).thenReturn(Optional.of(userDetails));
        when(mapper.map(Optional.of(userDetails), ProfileDTO.class)).thenReturn(profileDTO);
        when(genericResponseFactory.successResponse(HttpStatus.OK,
                profileDTO,
                "user.profile.success"))
                .thenReturn(expectedResponse);

        // Act
        GenericResponse<ProfileDTO> actualResponse = fullUserServiceService.getProfile(userId);

        // Assert
        assertNotNull(actualResponse);
        assertEquals(expectedResponse.getHttpStatus(), actualResponse.getHttpStatus());
        assertEquals(expectedResponse.getMessage(), actualResponse.getMessage());
        assertEquals(expectedResponse.getData(), actualResponse.getData());
        assertEquals(expectedResponse.getSuccess(), actualResponse.getSuccess());
        verify(userDetailsRepository,times(1)).findById(userId);
        verify(mapper,times(1)).map(Optional.of(userDetails), ProfileDTO.class);
        verify(genericResponseFactory,times(1)).successResponse(
                HttpStatus.OK,
                profileDTO,
                "user.profile.success");
        verify(genericResponseFactory,times(0)).errorResponse(
                HttpStatus.NOT_FOUND,
                null,
                "user.profile.not.found");
    }

    @Test
    void testGetProfile_UserDoesNotExist() {
        // Arrange
        String userId = "12345";
        String messageKey = "user.profile.not.found";

        when(userDetailsRepository.findById(userId)).thenReturn(Optional.empty());
        when(genericResponseFactory.errorResponse(eq(HttpStatus.NOT_FOUND),
                any(),
                eq(messageKey)
                ))
                .thenReturn(GenericResponse.builder()
                .httpStatus(HttpStatus.NOT_FOUND)
                .data(null)
                .message(messageKey)
                .success(false)
                .build());

        // Act
        GenericResponse<ProfileDTO> actualResponse = fullUserServiceService.getProfile(userId);

        // Assert
        assertNotNull(actualResponse);
        assertEquals(HttpStatus.NOT_FOUND, actualResponse.getHttpStatus());
        assertEquals(messageKey, actualResponse.getMessage());
        assertNull(actualResponse.getData());
        assertFalse(actualResponse.getSuccess());
        verify(userDetailsRepository,times(1)).findById(userId);
        verify(genericResponseFactory,times(1)).errorResponse(
                HttpStatus.NOT_FOUND,
                null,
                "user.profile.not.found");
    }
}
