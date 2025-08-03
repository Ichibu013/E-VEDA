package com.project.Gateway.infrastructure.config;

import com.project.Gateway.api.filter.JwtAuthenticationFilter;
import com.project.Gateway.service.impl.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * SecurityConfig is a configuration class for setting up Spring Security in the application.
 * It defines the security policies and configurations, such as authentication providers,
 * password encoding, and request filtering, to ensure that the application is properly secured.
 * <br>
 * Responsibilities: <br>
 * - Configures the HTTP security settings using a SecurityFilterChain bean. <br>
 * - Defines the authentication provider to manage user authentication. <br>
 * - Sets up a password encoder for hashing and verifying user passwords. <br>
 * - Integrates a custom JwtAuthenticationFilter to handle JWT-based authentication. <br>
 * <br>
 * Dependencies: <br>
 * - UserDetailsServiceImpl: Custom implementation of the UserDetailsService interface for fetching user-specific data. <br>
 * - JwtAuthenticationFilter: Filter implementation for handling JWT token validation and authentication. <br>
 * <br>
 * Key Security Configuration: <br>
 * - Disables CSRF protection as the application uses JWT for authentication. <br>
 * - Configures stateless session management. <br>
 * - Grants unrestricted access to authentication routes while securing other routes. <br>
 * - Configures a custom authentication provider and password encoder. <br>
 * - Adds JwtAuthenticationFilter to the security filter chain before the UsernamePasswordAuthenticationFilter. <br>
 * <br>
 * Bean Overview: <br>
 * - SecurityFilterChain: Configures HTTP security settings, request-based access policies, and custom filters. <br>
 * - AuthenticationProvider: Configures a DaoAuthenticationProvider with a custom UserDetailsService and password encoder. <br>
 * - AuthenticationManager: Provides the default authentication manager configured by Spring Security. <br>
 * - PasswordEncoder: Configures BCryptPasswordEncoder for secure hashing of passwords. <br>
 */
@Configuration("apiConfig")
@EnableWebSecurity
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(UserDetailsServiceImpl userDetailsService,
                          JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    /**
     * Configures the Spring Security filter chain, defining security policies,
     * authentication mechanisms, and request authorizations.
     * <p>
     * This method configures a stateless session management policy, disables CSRF,
     * and sets up request-based authorization rules, including permitting all requests
     * to endpoints under `/api/auth/**` and requiring authentication for all other requests.
     * It also assigns a custom authentication provider and integrates a JWT-based
     * authentication filter into the filter chain.
     *
     * @param httpSecurity the HttpSecurity object to configure the application’s security settings
     * @return a fully configured SecurityFilterChain that represents the security configuration
     * @throws Exception if an error occurs while building the security configuration
     */
    @Bean(name = "apiSecurityFilterChain")
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf(AbstractHttpConfigurer::disable)
                .securityMatcher("/password/**","/api/auth/**")
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/password/**","/api/auth/**").permitAll()
                                .anyRequest().authenticated())
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);


        return httpSecurity.build();
    }

    /**
     * Configures and provides an instance of {@code AuthenticationProvider} for the
     * application, which is used by Spring Security to handle authentication processes.
     * <p>
     * This method uses a {@code DaoAuthenticationProvider} to authenticate users
     * against a data source. It sets a {@code UserDetailsService} for retrieving user
     * details and a {@code PasswordEncoder} to handle password hashing and verification.
     *
     * @return an {@code AuthenticationProvider} configured with the application's
     *         {@code UserDetailsService} and {@code PasswordEncoder}
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }

    /**
     * Provides an {@code AuthenticationManager} bean to handle authentication requests
     * within the application. The {@code AuthenticationManager} is used by Spring Security
     * to delegate authentication requests to the configured {@code AuthenticationProvider}.
     *
     * @param authenticationConfiguration the {@code AuthenticationConfiguration} containing
     *                                     the application’s authentication setup and providers
     * @return an {@code AuthenticationManager} instance configured based on the provided
     *         {@code AuthenticationConfiguration}
     * @throws Exception if an error occurs while obtaining the {@code AuthenticationManager}
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}