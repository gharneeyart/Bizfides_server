import nodemailer from 'nodemailer';
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE } from './emailTemplates.js';
import dotenv from 'dotenv';

dotenv.config(); 

// Configure the Nodemailer transporter using environment variables for email authentication
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Specify the email service provider (e.g., Gmail)
  auth: {
    user: process.env.EMAIL_USER, // Email address used for sending emails
    pass: process.env.EMAIL_PASS, // Email account password
  },
});

/**
 * Sends an email verification message to the user.
 *
 * @param {string} email - Recipient's email address.
 * @param {string} firstName - User's first name for personalization.
 * @param {string} verifyCode - Verification link or code to include in the email.
 * @returns {Promise} - Promise representing the result of the email sending process.
 */
export const sendVerifyEmail = (email, firstName, verifyCode) => {
  const mailOptions = {
    from: `"Bizfides" <${process.env.EMAIL_USER}>`, // Sender name and email
    to: email, // Recipient's email address
    subject: 'Email Verification', // Email subject line
    html: VERIFICATION_EMAIL_TEMPLATE
      .replace("{firstName}", firstName) // Replace placeholder with user's first name
      .replace("{verificationLink}", verifyCode), // Replace placeholder with the verification link
    category: "Email Verification", // Optional category for email tracking
  };

  return transporter.sendMail(mailOptions); // Send the email
};

// Send password reset email
export const sendResetEmail = (email, firstName, resetURL) => {
  const mailOptions = {
    from: `"Bizfides" <${process.env.EMAIL_USER}>`, // Sender name and email
    to: email, // Recipient's email address
    subject: 'Password Reset Request', // Email subject line
    html: PASSWORD_RESET_REQUEST_TEMPLATE
      .replace("{firstName}", firstName) // Replace placeholder with user's first name
      .replace("{resetURL}", resetURL), // Replace placeholder with the reset URL
    category: "Reset Password", // Optional category for email tracking
  };

  return transporter.sendMail(mailOptions); // Send the email
};
