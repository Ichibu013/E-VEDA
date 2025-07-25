package com.project.Gateway.repository;

import com.project.Gateway.domain.entity.UserLogin;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for managing UserLogin entities in the database.
 * </p> <p>
 * This interface provides MongoDB access methods for the UserLogin entity,
 * enabling CRUD operations as well as custom query execution. It extends the
 * MongoRepository interface to inherit standard database operation methods.
 * </p> <p>
 * Functionalities:
 * - Provides methods to perform database operations on the UserLogin entity.
 * - Allows retrieval of a UserLogin entity using the user's email address via a custom query method.
 * </p> <p>
 * The UserLogin entity represents user login information such as username, email,
 * password, status, and additional details stored in the FullUserDetails entity.
 * It is mapped to the "user_login" collection in MongoDB.
 * </p> <p>
 * Annotations:
 * - @Repository: Indicates that this interface is a Spring Data repository and
 *   facilitates dependency injection and persistence management.
 * </p> <p>
 * Extends:
 * - MongoRepository<UserLogin, String>: Provides generic methods for database
 *   operations using UserLogin as the entity type and String as the ID type.
 * </p> <p>
 * Custom Methods:
 * - Optional<UserLogin> findByEmail(String email): Retrieves a UserLogin entity
 *   based on the email address, if one exists.
 */
@Repository

public interface IUserRepository extends MongoRepository<UserLogin, String> {
    Optional<UserLogin> findByEmail(String email);
}
