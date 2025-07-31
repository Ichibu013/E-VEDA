package com.project.Gateway.api.filter;

import com.project.Gateway.service.impl.UserDetailsServiceImpl;
import com.project.common.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JwtAuthenticationFilter is a filter implementation used to handle JWT-based authentication
 * for incoming HTTP requests. It extends OncePerRequestFilter to ensure the filter is executed
 * once per request.
 * <br>
 * The filter extracts a JWT token from the Authorization header of the HTTP request. If the
 * token is present and valid, it retrieves the associated user details, validates the token
 * against the user details, and sets the authentication information in the SecurityContext.
 *  <br>
 * Responsibilities: <br>
 * - Extract the JWT token from the "Authorization" header of the request. <br>
 * - Validate the extracted JWT token. <br>
 * - Retrieve the username from the token using the JwtService. <br>
 * - Load user details using UserDetailsServiceImpl. <br>
 * - Set authentication in the SecurityContextHolder if the token is valid and the user is authenticated. <br>
 * <br>
 * Dependencies: <br>
 * - JwtService: Used to extract, validate, and process the JWT token. <br>
 * - UserDetailsServiceImpl: Loads the user information based on the username extracted from the token. <br>
 * <br>
 * Method Overview: <br>
 * - `doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)`:
 *   Main implementation of the filter logic. Processes the incoming request, validates the token,
 *   retrieves user details, and sets up authentication in the security context.
 * <br>
 * Usage:
 * To use this filter, it should be added as a pre-authentication filter in the Spring Security
 * filter chain, typically before `UsernamePasswordAuthenticationFilter`.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userLoginService;

    public JwtAuthenticationFilter(JwtService jwtService,
                                   UserDetailsServiceImpl userLoginService) {
        this.jwtService = jwtService;
        this.userLoginService = userLoginService;
    }

    /**
     * Processes the HTTP request and response to verify and authenticate JSON Web Tokens (JWT).
     * This filter checks the "Authorization" header of the incoming request to determine if a JWT is present and valid.
     * If the JWT is valid, the user's authentication is set in the security context.
     *
     * @param request the HTTP request being processed
     * @param response the HTTP response being processed
     * @param filterChain the chain of filters to continue processing the request
     * @throws ServletException if an error occurs during filtering
     * @throws IOException if an input or output exception occurs
     */
    @Override
    protected void doFilterInternal(@NotNull HttpServletRequest request,
                                    @NotNull HttpServletResponse response,
                                    @NotNull FilterChain filterChain)
            throws ServletException, IOException {
        final String authorizationHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        if(authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authorizationHeader.substring(7);
        username = jwtService.extractEmail(jwt);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userLoginService.loadUserByUsername(username);
            if (jwtService.isTokenValid(jwt, userDetails)){
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        filterChain.doFilter(request, response);
    }
}
