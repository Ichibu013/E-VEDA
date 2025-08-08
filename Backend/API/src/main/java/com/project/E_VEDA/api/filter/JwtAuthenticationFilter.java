package com.project.E_VEDA.api.filter;

import com.project.E_VEDA.service.impl.UserDetailsServiceImpl;
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
 * JwtAuthenticationFilter is a custom implementation of the OncePerRequestFilter
 * to perform JWT-based authentication on incoming HTTP requests.
 * <p>
 * This filter checks for the presence of a JWT in the Authorization header of the
 * HTTP request. If a valid JWT is found, it retrieves the corresponding user details,
 * validates the token, and sets the security context for the current request.
 * </p>
 * Key responsibilities: <br>
 * - Extracts the JWT token from the Authorization header of the request. <br>
 * - Uses {@link JwtService} to extract the username from the token and validate the token. <br>
 * - Loads user details using {@link UserDetailsServiceImpl}. <br>
 * - If the token is valid, sets the user authentication details in the
 *   {@link SecurityContextHolder} for further processing. <br>
 * - Handles exceptions that may occur during the process and sets appropriate
 *   HTTP responses. <br>
 */
@Component("gatewayJwtAuthenticationFilter")
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsServiceImpl userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }
    /**
     * Filters incoming HTTP requests to validate and extract authentication information from a JWT token.
     * This implementation checks for the presence of an 'Authorization' header, verifies the token,
     * and sets the appropriate authentication in the security context if the token is valid.
     *
     * @param request the HttpServletRequest object that contains the client request
     * @param response the HttpServletResponse object that contains the response the servlet sends to the client
     * @param filterChain the FilterChain object to pass the request and response to the next filter
     * @throws ServletException if an error occurs during filtering
     * @throws IOException if an I/O error occurs during filtering
     */
    @Override
    protected void doFilterInternal(
            @NotNull HttpServletRequest request,
            @NotNull HttpServletResponse response,
            @NotNull FilterChain filterChain)
            throws ServletException, IOException {
        final String apiAuthorizationHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        if(apiAuthorizationHeader == null || !apiAuthorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = apiAuthorizationHeader.substring(7);
        try {
            username = jwtService.extractEmail(jwt);
            if (username != null && jwtService.isTokenValid(jwt, userDetailsService.loadUserByUsername(username))) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(jwt);
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
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid JWT token: " + e.getMessage() + "\n");
        }
        filterChain.doFilter(request, response);
    }
}
