package com.project.Gateway.repository;

import com.project.Gateway.domain.entity.PasswordResetToken;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface IPasswordResetTokenRepository extends MongoRepository<PasswordResetToken, String> {
    PasswordResetToken findByToken(String token);
}
