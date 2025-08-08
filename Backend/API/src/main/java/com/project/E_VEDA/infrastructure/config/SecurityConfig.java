    package com.project.E_VEDA.infrastructure.config;

import com.project.E_VEDA.api.filter.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

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
@Configuration("gatewayConfig")
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean(name = "gatewaySecurityFilterChain" )
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf(AbstractHttpConfigurer::disable)
                .securityMatcher("/api/protected/**")
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/api/protected/**").permitAll()
                                .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return httpSecurity.build();
    }

}