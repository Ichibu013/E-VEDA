package iam

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"
)

func SaveOTP(rdb *redis.Client, key string, otp string) error {
	return rdb.Set(context.Background(), key, otp, 0).Err()
}

func SaveResetToken(rdb *redis.Client, token, email string) error {
	return rdb.Set(context.Background(), "reset:"+token, email, 10*time.Minute).Err()
}

func VerifyOTP(rdb *redis.Client, email, inputOtp string) (bool, error) {
	val, err := rdb.Get(context.Background(), "otp:"+email).Result()
	if err != nil {
		return false, nil
	}
	return val == inputOtp, nil
}

func VerifyResetToken(rdb *redis.Client, token string) (bool, error) {
	val, err := rdb.Get(context.Background(), "reset:"+token).Result()
	if err != nil {
		return false, err
	}
	return token == val, nil
}
