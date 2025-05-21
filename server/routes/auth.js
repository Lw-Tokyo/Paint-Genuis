// server/routes/auth.js 
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const validateEmail = (email) => {
  // Basic email format validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }
  
  // Additional checks for repeated TLDs and other issues
  const domain = email.split('@')[1];
  const domainParts = domain.split('.');
  const tlds = ['com', 'net', 'org', 'edu', 'gov', 'mil', 'io', 'co', 'ai', 'app'];
  
  // Check for patterns like domain.com.com
  for (let tld of tlds) {
    if (domain.includes(`.${tld}.${tld}`)) {
      return { isValid: false, error: 'Please enter a valid email address.' };
    }
  }

  // Check for unreasonably long TLDs (likely mistakes)
  if (domainParts[domainParts.length - 1].length > 10) {
    return { isValid: false, error: 'Invalid email domain format.' };
  }
  
  return { isValid: true };
};

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Email Transporter Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error configuring transporter:", error);
  } else {
    console.log("Transporter is ready to send emails.");
  }
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;
  const allowedRoles = ['contractor', 'painter', 'client'];

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ error: 'Please Select role' });
  }

  const nameRegex = /^[A-Za-z\s]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  
  // Use the new email validation function
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return res.status(400).json({ error: emailValidation.error });
  }

  if (!nameRegex.test(name)) {
    return res.status(400).json({ error: 'Name can only contain letters and spaces.' });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({ 
      error: 'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.' 
    });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000;

    const user = new User({
      name,
      email,
      password,
      role,
      verificationToken,
      verificationExpires,
      isVerified: false,
    });

    await user.save();

    // Send verification email
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    
    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'Email Verification',
      html: `
        <p>Hello ${name},</p>
        <p>Thank you for signing up! Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error("Error sending verification email:", err);
        return res.status(500).json({ error: 'Failed to send verification email' });
      }
      
      console.log("Verification email sent successfully to:", email);
      res.status(201).json({
        message: 'User created successfully. Please check your email to verify your account.',
      });
    });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Validate email format
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  
  // Additional check for repeated TLDs
  const domain = email.split('@')[1];
  const domainParts = domain.split('.');
  const tlds = ['com', 'net', 'org', 'edu', 'gov', 'mil', 'io', 'co', 'ai', 'app'];
  
  // Check for patterns like domain.com.com
  for (let tld of tlds) {
    if (domain.includes(`.${tld}.${tld}`)) {
      return res.status(400).json({ error: 'Invalid email domain format.' });
    }
  }
  
  // Check for unreasonably long TLDs (likely mistakes)
  if (domainParts[domainParts.length - 1].length > 10) {
    return res.status(400).json({ error: 'Invalid email domain format.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Special exception for admin - don't require email verification
    if (!user.isVerified && user.role !== 'admin') {
      return res.status(401).json({ error: 'Please verify your email before logging in' });
    }

    // Generate authentication token
    const token = generateToken(user);

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/verify/:token
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;

  try {
    // First check if user exists with this token, regardless of expiry
    const user = await User.findOne({
      verificationToken: token,
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    // If user is already verified, return success
    if (user.isVerified) {
      return res.status(200).json({ message: 'Email already verified. You can log in.' });
    }

    // Check if token is expired only if the user is not yet verified
    if (user.verificationExpires < Date.now()) {
      return res.status(400).json({ error: 'Verification token has expired' });
    }

    // Update user to verified status
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Email successfully verified. You can now log in.' });

  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/check-verified/:token
router.get('/check-verified/:token', async (req, res) => {
  const { token } = req.params;

  try {
    // Find the user associated with this token, regardless of expiry
    const user = await User.findOne({
      verificationToken: token,
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found with this token' });
    }

    // Return whether the user is already verified
    return res.status(200).json({ 
      isVerified: user.isVerified,
      message: user.isVerified ? 
        'Email already verified. You can log in.' : 
        'Email not yet verified.'
    });

  } catch (err) {
    console.error("Check Verification Status Error:", err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/resend-verification
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;
  
  // Validate email format
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  
  // Additional check for repeated TLDs
  const domain = email.split('@')[1];
  const domainParts = domain.split('.');
  const tlds = ['com', 'net', 'org', 'edu', 'gov', 'mil', 'io', 'co', 'ai', 'app'];
  
  // Check for patterns like domain.com.com
  for (let tld of tlds) {
    if (domain.includes(`.${tld}.${tld}`)) {
      return res.status(400).json({ error: 'Invalid email domain format.' });
    }
  }
  
  // Check for unreasonably long TLDs (likely mistakes)
  if (domainParts[domainParts.length - 1].length > 10) {
    return res.status(400).json({ error: 'Invalid email domain format.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'User is already verified' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    user.verificationExpires = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    // Send verification email
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Email Verification',
      html: `
        <p>Hello ${user.name},</p>
        <p>You requested a new verification email. Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error("Error sending verification email:", err);
        return res.status(500).json({ error: 'Failed to send verification email' });
      }
      
      console.log("Verification email sent successfully to:", user.email);
      res.status(200).json({ message: 'Verification email has been sent.' });
    });

  } catch (err) {
    console.error("Resend Verification Error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  console.log("Forgot Password Request Received for Email:", email);
  
  // Validate email format
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  
  // Additional check for repeated TLDs
  const domain = email.split('@')[1];
  const domainParts = domain.split('.');
  const tlds = ['com', 'net', 'org', 'edu', 'gov', 'mil', 'io', 'co', 'ai', 'app'];
  
  // Check for patterns like domain.com.com
  for (let tld of tlds) {
    if (domain.includes(`.${tld}.${tld}`)) {
      return res.status(400).json({ error: 'Invalid email domain format.' });
    }
  }
  
  // Check for unreasonably long TLDs (likely mistakes)
  if (domainParts[domainParts.length - 1].length > 10) {
    return res.status(400).json({ error: 'Invalid email domain format.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found with email:", email);
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    console.log("Reset URL Generated:", resetUrl);

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset Request',
      html: `
        <p>Hello ${user.name},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error("Error sending email:", err);
        return res.status(500).json({ error: 'Failed to send reset email' });
      }

      console.log("Password reset email sent successfully to:", email);
      res.status(200).json({ message: 'Password reset email has been sent.' });
    });

  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.',
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password successfully reset. You can now log in.' });

  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;