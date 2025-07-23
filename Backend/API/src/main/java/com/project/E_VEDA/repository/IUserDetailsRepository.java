package com.project.E_VEDA.repository;

import com.project.E_VEDA.domain.entity.FullUserDetails;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for managing FullUserDetails entities in the database.
 *
 * This interface provides MongoDB access methods for the FullUserDetails entity,
 * enabling CRUD operations and query execution. It extends the MongoRepository
 * interface, inheriting predefined database operation methods.
 *
 * The FullUserDetails entity represents detailed user information, including
 * personal details such as name, phone number, date of birth, address, and gender.
 * The entity is mapped to the "user" collection in MongoDB.
 *
 * Annotations:
 * - @Repository: Indicates that this interface is a Spring Data repository and
 *   allows for dependency injection and persistence management.
 *
 * Extends:
 * - MongoRepository<FullUserDetails, String>: Provides generic MongoDB handling
 *   methods using FullUserDetails as the entity type and String as the ID type.
 */
@Repository
public interface IUserDetailsRepository extends MongoRepository<FullUserDetails, String> {
}
