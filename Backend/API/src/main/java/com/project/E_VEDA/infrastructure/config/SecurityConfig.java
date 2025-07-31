package com.project.E_VEDA.infrastructure.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.E_VEDA.api.filter.JwtAuthenticationFilter;
import com.project.common.common.utils.GenericResponseFactory;
import com.project.common.dto.response.GenericResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.naming.AuthenticationException;
import java.io.IOException;

/**
 * SecurityConfig is a configuration class that sets up the security features for the application.
 * It leverages Spring Security features such as authentication filtering, method security, and password encoding.
 * This class defines the necessary beans and security chain configurations for protecting the API endpoints.
 * <p>
 * Key features: <br>
 * - Disables CSRF protection since the application operates in a stateless manner. <br>
 * - Configures session management to be stateless. <br>
 * - Defines authorization rules for API endpoints. <br>
 * - Adds custom JWT-based authentication filter to the security filter chain to handle user authentication. <br>
 * - Implements a password encoder for securely hashing passwords. <br>
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final GenericResponseFactory genericResponseFactory;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(GenericResponseFactory genericResponseFactory, JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.genericResponseFactory = genericResponseFactory;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/api/protected/**").permitAll()
                                .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
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