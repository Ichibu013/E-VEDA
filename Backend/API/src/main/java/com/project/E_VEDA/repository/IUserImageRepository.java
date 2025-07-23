package com.project.E_VEDA.repository;

import com.project.E_VEDA.domain.entity.UserImage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for managing UserImage entities in the database.
 *
 * This interface provides MongoDB access methods for the UserImage entity,
 * enabling CRUD operations as well as custom query execution. It extends the
 * MongoRepository interface to inherit standard database operation methods.
 *
 * Functionalities:
 * - Allows retrieval of a user's image in binary format (byte[]) using the
 *   unique identifier (uid) associated with the user through a custom query method.
 *
 * The UserImage entity represents user-specific image data, including metadata
 * and the binary representation of the image. It is mapped to the "user_image"
 * collection in MongoDB.
 *
 * Annotations:
 * - @Repository: Indicates that this interface is a Spring Data repository and
 *   facilitates dependency injection and persistence management.
 *
 * Extends:
 * - MongoRepository<UserImage, String>: Provides generic methods for database
 *   operations using UserImage as the entity type and String as the ID type.
 *
 * Custom Methods:
 * - Optional<byte[]> findImageByUid(String uid): Retrieves the binary data of
 *   an image for a given user, identified by their unique uid.
 */
@Repository
public interface IUserImageRepository extends MongoRepository<UserImage, String> {
    Optional<UserImage> findImageByUid(String uid);

    void delete(Optional<UserImage> userImage);
}
