package com.project.E_VEDA.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Arrays;
import java.util.Objects;

/**
 * Represents an entity for storing user image-related information.
 * This class is mapped to the "user_image" collection in MongoDB as well as being
 * a JPA entity for relational database mapping.
 * <p>
 * The UserImage class handles the following attributes: <br>
 * - A unique identifier (uid) representing the user. <br>
 * - A reference to the FullUserDetails entity for extended user information. <br>
 * - An image name associated with the user's image. <br>
 * - The binary (byte[]) representation of the user's image. <br>
 * </p> <p>
 * Annotations: <br>
 * - @Document: Maps this class to the "user_image" collection in MongoDB. <br>
 * - @Data: Lombok annotation to generate boilerplate code like getters, setters, hashCode, equals, etc. <br>
 * - @NoArgsConstructor: Generates a no-argument constructor. <br>
 * - @AllArgsConstructor: Generates a constructor with all fields as parameters. <br>
 * </p> <p>
 * Relationships: <br>
 * - A one-to-one relationship with the FullUserDetails entity through the "user_id" foreign key. <br>
 * </p>
 * Overrides: <br>
 * - equals(): Compares all attributes for equality, including comparing image arrays deeply. <br>
 * - hashCode(): Calculates a hash code based on the attributes, including image byte arrays. <br>
 * - toString(): Provides a string representation of the UserImage entity. <br>
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "user_image")
public class UserImage {

    @Id
    @Column(name = "user_id")
    private String uid;

    @OneToOne
    @JoinColumn(name = "user_id")
    private FullUserDetails fullUserDetails;

    @Column(name = "image_name")
    private String imageName;

    @Column(name = "image")
    private byte[] image;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        UserImage userImage = (UserImage) o;
        return Objects.equals(uid, userImage.uid) &&
                Objects.equals(fullUserDetails, userImage.fullUserDetails) &&
                Objects.equals(imageName, userImage.imageName) &&
                Objects.deepEquals(image, userImage.image);
    }

    @Override
    public int hashCode() {
        return Objects.hash(uid,
                fullUserDetails,
                imageName,
                Arrays.hashCode(image));
    }

    @Override
    public String toString() {
        return "UserImage{" +
                "uid='" + uid + '\'' +
                ", fullUserDetails=" + fullUserDetails +
                ", imageName='" + imageName + '\'' +
                ", image=" + Arrays.toString(image) +
                '}';
    }
}
