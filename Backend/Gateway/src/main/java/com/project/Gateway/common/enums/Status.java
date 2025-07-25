package com.project.Gateway.common.enums;

/**
 * Represents the possible statuses of an entity, such as a user account.
 * <p>
 * This enumeration is typically used to define and manage the state of an entity
 * in the application. By using predefined constants, it ensures consistency and
 * restricts the allowable values to the defined set of statuses.
 * </p>
 * Enum constants:
 * - ACTIVE: Indicates that the entity is active and operational.
 * - INACTIVE: Indicates that the entity is inactive but not removed.
 * - BLOCKED: Indicates that the entity is blocked and temporarily unusable.
 * - DELETED: Indicates that the entity has been removed or marked as deleted.
 */
public enum Status {
    ACTIVE, INACTIVE, BLOCKED, DELETED,
}
