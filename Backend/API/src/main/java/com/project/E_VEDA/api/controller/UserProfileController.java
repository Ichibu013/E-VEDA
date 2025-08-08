package com.project.E_VEDA.api.controller;

import com.project.E_VEDA.dto.fullUserDetails.ProfileDTO;
import com.project.E_VEDA.service.interfaces.IUserProfileService;
import com.project.common.dto.response.GenericResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/protected")
public class UserProfileController {

   private final IUserProfileService userProfileService;

    public UserProfileController(IUserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @PostMapping("/user/create-update")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<GenericResponse<ProfileDTO>> createAndUpdateProfile(ProfileDTO profileDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();
        return ResponseEntity.status(HttpStatus.CREATED).body(userProfileService.createAndUpdateProfile(userId, profileDTO));
    }


    @GetMapping("/user/get-details")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<GenericResponse<ProfileDTO>> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();
        return ResponseEntity.status(HttpStatus.FOUND).body(userProfileService.getProfile(userId));
    }

    @PostMapping("/user/delete")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<GenericResponse<ProfileDTO>> deleteProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();
        return ResponseEntity.status(HttpStatus.GONE).body(userProfileService.deleteProfile(userId));
    }

    @PostMapping("/public")
    public ResponseEntity<?> publicMethod() {
        return ResponseEntity.ok().body("Public method");
    }

}
