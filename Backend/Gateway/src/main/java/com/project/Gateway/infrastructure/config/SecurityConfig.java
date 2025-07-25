package com.project.Gateway.infrastructure.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.Gateway.common.utils.GenericResponseFactory;
import com.project.Gateway.dto.response.GenericResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import javax.naming.AuthenticationException;
import java.io.IOException;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final GenericResponseFactory genericResponseFactory;

    public SecurityConfig(GenericResponseFactory genericResponseFactory) {
        this.genericResponseFactory = genericResponseFactory;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        httpSecurity.authorizeHttpRequests(authorizeRequests ->
                authorizeRequests
                        .anyRequest()
                        .permitAll());

        return httpSecurity.build();
    }

    private void handleAuthenticationException(HttpServletRequest request,
                                               HttpServletResponse response,
                                               String errorMessage,
                                               HttpStatus status,
                                               AuthenticationException e) throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        GenericResponse<?> genericResponse = genericResponseFactory.errorResponse(status,
                null,
                errorMessage,
                e);
        response.getWriter().write(new ObjectMapper().writeValueAsString(genericResponse));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}