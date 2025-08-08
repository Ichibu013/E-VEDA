package com.project.Gateway.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.E_VEDA.repository.IUserDetailsRepository;
import com.project.Gateway.dto.userLogin.LoginDTO;
import com.project.Gateway.repository.IUserRepository;
import com.project.Gateway.service.interfaces.IUserLoginService;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
//@WebMvcTest(AuthController.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private IUserRepository userRepository;

    @Mock
    private IUserDetailsRepository userDetailsRepository;

    @Mock
    private IUserLoginService userLoginService;

    @Autowired
    private ObjectMapper objectMapper;

/*    @Test
    void testLogin_ValidCredentials_ReturnsOk() throws Exception {
        LoginDTO loginDTO = LoginDTO.builder()
                .username("validUser")
                .email("test@example.com")
                .password("securePassword")
                .build();

        AuthResponse expectedResponse = new AuthResponse("mockJwt", Collections.singleton("ROLE_USER"));

        Mockito.when(userLoginService.authenticate(any(LoginDTO.class))).thenReturn(expectedResponse);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedResponse.toString(), true));
    }*/

    @Test
    void testLogin_MissingUsername_ReturnsBadRequest() throws Exception {
        LoginDTO loginDTO = LoginDTO.builder()
                .email("test@example.com")
                .password("securePassword")
                .build();

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLogin_InvalidEmail_ReturnsBadRequest() throws Exception {
        LoginDTO loginDTO = LoginDTO.builder()
                .username("validUser")
                .email("invalid-email")
                .password("securePassword")
                .build();

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLogin_MissingPassword_ReturnsBadRequest() throws Exception {
        LoginDTO loginDTO = LoginDTO.builder()
                .username("validUser")
                .email("test@example.com")
                .build();

        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isBadRequest());
    }
}