package com.project.E_VEDA.domain.entity;

import com.project.E_VEDA.common.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Objects;

/**
 * Represents the FullUserDetails entity.
 * This class serves as both a JPA entity for relational databases and a document
 * entity for MongoDB, mapped to the "user" collection. It is used to store and manage
 * detailed user information, including personal and contact details.
 * <p>
 * The FullUserDetails entity includes the following attributes: <br>
 * - A unique, non-updatable identifier (uid). <br>
 * - The user's full name (name). <br>
 * - The user's phone number (phone). <br>
 * - The user's date of birth (dob), stored as a string in DATE format. <br>
 * - The user's address (address), with a maximum length of 1000 characters. <br>
 * - The user's gender (gender), represented by the Gender enumeration. <br>
 * - The record's last updated timestamp (updatedDate), automatically updated. <br>
 * </p> <p>
 * Annotations: <br>
 * - @Data: Automatically generates getter, setter, toString, equals, and hashCode methods. <br>
 * - @NoArgsConstructor: Generates a no-arguments constructor. <br>
 * - @AllArgsConstructor: Generates a constructor with all arguments. <br>
 * - @Document: Maps this entity to the "user" collection in MongoDB. <br>
 * - @Id: Specifies the primary key. <br>
 * - @Column: Specifies column details, including constraints and definitions. <br>
 * - @Enumerated: Maps the gender attribute to a string representation in the database. <br>
 * </p>
 * Overridden Methods: <br>
 * - equals(): Compares this instance with another FullUserDetails object for equality. <br>
 * - hashCode(): Generates a hash code for the FullUserDetails object. <br>
 * - toString(): Provides a string representation of the FullUserDetails object, including all fields. <br>
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user")
public class FullUserDetails {

    @Id
    private String uid;

    @Field(name = "name")
    private String name;

    @Field(name = "phone")
    private Integer phone;

    @Field(name = "dob")
    private String dob;

    @Field(name = "address")
    private String address;

    @Field(name = "gender")
    private Gender gender;

    @Field(name = "updated_date")
    private String updatedDate;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        FullUserDetails that = (FullUserDetails) o;
        return Objects.equals(uid, that.uid) &&
                Objects.equals(name, that.name) &&
                Objects.equals(phone, that.phone) &&
                Objects.equals(dob, that.dob) &&
                Objects.equals(address, that.address) &&
                gender == that.gender &&
                Objects.equals(updatedDate, that.updatedDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(uid,
                name,
                phone,
                dob,
                address,
                gender,
                updatedDate
        );
    }

    @Override
    public String toString() {
        return "FullUserDetails{" +
                "uid='" + uid + '\'' +
                ", name='" + name + '\'' +
                ", phone=" + phone +
                ", dob='" + dob + '\'' +
                ", address='" + address + '\'' +
                ", gender=" + gender +
                ", updatedDate='" + updatedDate + '\'' +
                '}';
    }
}
