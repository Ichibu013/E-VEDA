package iam

import (
	"fmt"
	"net/smtp"
	"os"
)

func SendOTPEmail(to, otp string) error {
	from := os.Getenv("SMTP_USER")
	pass := os.Getenv("SMTP_PASS")
	host := os.Getenv("SMTP_HOST")
	port := os.Getenv("SMTP_PORT")

	msg := fmt.Sprintf("Subject: Your E-VEDA Reset code\n\n Your OTP is %s.\n It expires in 5 minutes.", otp)

	auth := smtp.PlainAuth("", from, pass, host)
	return smtp.SendMail(host+":"+port, auth, from, []string{to}, []byte(msg))
}
