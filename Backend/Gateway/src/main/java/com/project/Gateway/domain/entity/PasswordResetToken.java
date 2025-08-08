package com.project.Gateway.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "password_reset_token")
public class PasswordResetToken {

    @Id
    private String id;

    @Field(name = "token")
    private String token;

    @DBRef(lazy = true)
    @Field(name = "user_id")
    private UserLogin userLogin;

    @Field(name = "expiry_date")
    private Date expiryDate;


}
