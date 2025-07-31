package com.project.common.common.emuns;

/**
 * Defines the roles available within the application.
 * <p>
 * This enumeration is utilized to specify and manage user roles, such as
 * administrative privileges or standard user access levels. It ensures consistency
 * by restricting role assignments to the predefined constants.
 * </p>
 * Enum constants:
 * - ROLE_USER: Represents a standard user with basic access privileges.
 * - ROLE_ADMIN: Represents an administrative user with elevated access privileges.
 */
public enum Role {
    ROLE_USER, ROLE_ADMIN
}
