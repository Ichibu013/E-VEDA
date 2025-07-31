package com.project.E_VEDA.service.impl;

import com.project.common.service.JwtService;
import io.jsonwebtoken.Claims;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

/**
 * UserDetailsServiceImpl is an implementation of the Spring Security UserDetailsService interface.
 * It provides functionality to load user-specific data required for authentication and authorization
 * by extracting details from a JWT token.
 * <p>
 * The primary role of this class is to decode a JWT token, extract the username and assigned roles,
 * and construct a UserDetails object representing the authenticated user.
 */
@Service( "apiUserDetailsService")
public class UserDetailsServiceImpl implements UserDetailsService {

    private final JwtService jwtService;

    public UserDetailsServiceImpl(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    /**
     * Loads a user's details by extracting the username and roles from a given JWT token.
     * This method uses the provided token to retrieve the user's claims, including the username
     * and associated roles, and constructs a UserDetails object with those details.
     *
     * @param token a JWT token containing the user's claims, including the subject (username) and roles
     * @return a UserDetails object containing the username and granted authorities (roles) extracted from the token
     * @throws UsernameNotFoundException if the username could not be found in the token
     */
    @Override
    public UserDetails loadUserByUsername(String token) throws UsernameNotFoundException {
        String username = jwtService.extractClaim(token,Claims::getSubject);
        List<String> roles = jwtService.extractClaim(token, claims -> claims.get("roles", List.class));

        if (username == null) {
            throw new UsernameNotFoundException("The username was not found in the token");
        }

        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(roles.getFirst());

//        Collection<? extends SimpleGrantedAuthority> authorities = roles.stream()
//                .map(SimpleGrantedAuthority::new)
//                .toList();

        return new User(
                username,
                "",
                Collections.singleton(authority)
        );
    }
}
