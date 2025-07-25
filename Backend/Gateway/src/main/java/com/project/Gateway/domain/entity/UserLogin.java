package com.project.Gateway.domain.entity;

import com.project.E_VEDA.domain.entity.FullUserDetails;
import com.project.Gateway.common.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Objects;

/**
 * Represents a UserLogin entity.
 * This class is responsible for managing login information of a user.
 * It is mapped to the "user_login" collection in MongoDB and also acts as an
 * entity in JPA for relational database mapping.
 * </p> <p>
 * The UserLogin entity contains the following attributes: <br>
 * - A unique, non-updatable identifier (id). <br>
 * - A username associated with the user. <br>
 * - The user's email address (must be unique and non-null). <br>
 * - The password for account authentication (stored in an encrypted form). <br>
 * - The status of the user's account, represented by the Status enumeration. <br>
 * - A reference to the FullUserDetails entity which contains additional user information. <br>
 * - A creation date timestamp, which is unmodifiable and set to the current date and time by default. <br>
 * </p> <p>
 * The class also overrides common methods such as equals(), hashCode(), and toString()
 * to ensure proper comparison, hashing, and string representation of the entity.
 * </p> <p>
 * Annotations: <br>
 * - @Document: Maps this entity to the "user_login" collection in MongoDB. <br>
 * - @Data: Generates getter, setter, equals, hashCode, and toString methods. <br>
 * - @NoArgsConstructor: Generates a no-argument constructor. <br>
 * - @AllArgsConstructor: Generates an all-arguments constructor. <br>
 * </p> <p>
 * Relationships:
 * - A one-to-one relationship with the FullUserDetails entity through the "user_id" foreign key.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user_login")
public class UserLogin {

    @Id
    private String id;

    @Field(name = "username")
    private String username;

    @Field(name = "email")
    private String email;

    @Field(name = "password")
    private String password;

    @Field(name = "status")
    private Status status;

    @DBRef(lazy = true)
    @Field(name = "user_id")
    private FullUserDetails fullUserDetails;

    @Field(name = "created_date")
    private String createdDate;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        UserLogin userLogin = (UserLogin) o;
        return Objects.equals(id, userLogin.id) &&
                Objects.equals(username, userLogin.username) &&
                Objects.equals(email, userLogin.email) &&
                Objects.equals(password, userLogin.password) &&
                status == userLogin.status &&
                Objects.equals(fullUserDetails, userLogin.fullUserDetails) &&
                Objects.equals(createdDate, userLogin.createdDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id,
                username,
                email,
                password,
                status,
                fullUserDetails,
                createdDate);
    }

    @Override
    public String toString() {
        return "UserLogin{" +
                "id='" + id + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", status=" + status +
                ", fullUserDetails=" + fullUserDetails +
                ", createdDate='" + createdDate + '\'' +
                '}';
    }
}
