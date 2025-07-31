package com.project.E_VEDA.dto.fullUserDetails;

import lombok.Builder;
import lombok.Data;

/**
 * Data Transfer Object (DTO) for user profile information.
 * <p>
 * This class is designed to encapsulate the properties of a user's profile
 * in a simplified structure that can be used for data transfer between different
 * application layers such as services and controllers. It represents key profile
 * attributes such as name, contact details, date of birth, address, and gender.
 * </p>
 * The class leverages Lombok annotations for generating boilerplate code like
 * getters, setters, and builder patterns, simplifying the object creation process.
 */
@Data
@Builder
public class ProfileDTO {

    private String name;

    private Integer phone;

    private String dob;

    private String address;

    private String gender;
}
