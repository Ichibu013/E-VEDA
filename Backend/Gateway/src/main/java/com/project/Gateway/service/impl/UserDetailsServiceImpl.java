package com.project.Gateway.service.impl;

import com.project.Gateway.domain.entity.UserLogin;
import com.project.Gateway.repository.IUserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * Implementation of the Spring Security UserDetailsService interface for loading
 * user-specific data.
 * <p>
 * This service retrieves user information from the database and constructs a
 * UserDetails object that is used by Spring Security for authentication and authorization.
 * </p>
 * Responsibilities: <br>
 * - Fetches user details from the IUserRepository based on the provided username. <br>
 * - Constructs a UserDetails object containing the user's credentials and granted authorities. <br>
 * - Throws a UsernameNotFoundException if the user is not found in the database. <br>
 *  <br>
 * Dependencies: <br>
 * - IUserRepository: Repository interface for retrieving UserLogin entities. <br>
 *  <br>
 * Methods: <br>
 * - `loadUserByUsername(String username)`: Retrieves the user information and
 *   returns a UserDetails object for authentication.
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final IUserRepository userRepository;

    protected UserDetailsServiceImpl(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Loads the user's details based on the provided email address.
     * This method retrieves the user information from the repository and constructs
     * a {@link UserDetails} object containing the user's credentials and their
     * granted authorities for authentication and authorization in the security context.
     *
     * @param email the email address of the user attempting to authenticate
     * @return a {@link UserDetails} object that includes the user's username, password, and authorities
     * @throws UsernameNotFoundException if no user is found with the given email address
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserLogin user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email : " + email));

        Set<GrantedAuthority> authorities = user.getRole().stream()
                .map(role -> new SimpleGrantedAuthority(role.getDeclaringClass().getName()))
                .collect(Collectors.toSet());

        return new User(user.getUsername(), user.getPassword(), authorities);
    }
}
