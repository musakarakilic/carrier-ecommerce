const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Token generation function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Create admin user
const createAdmin = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Email check
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'This email address is already registered' });
    }

    // Create admin user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: 'admin' // Set role directly as admin
    });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Normal user registration
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'This email address is already registered' });
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName
    });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// User login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// User profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Only return profile image path
    const profileImage = user.profileImage || null;
    
    res.json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone || '',
      birthDate: user.birthDate || '',
      gender: user.gender || '',
      address: user.address || '',
      profileImage
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, birthDate, gender, address } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user information
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phone = phone || user.phone;
    user.birthDate = birthDate || user.birthDate;
    user.gender = gender || user.gender;
    user.address = address || user.address;

    const updatedUser = await user.save();
    
    // Only return profile image path
    const profileImage = updatedUser.profileImage || null;
    
    res.json({
      _id: updatedUser._id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
      phone: updatedUser.phone || '',
      birthDate: updatedUser.birthDate || '',
      gender: updatedUser.gender || '',
      address: updatedUser.address || '',
      profileImage
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check current password
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Set new password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Upload profile image
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete old profile image (if exists and not default)
    if (user.profileImage && !user.profileImage.includes('default.png')) {
      const oldImagePath = path.join(__dirname, '..', user.profileImage.replace(/^\//, '').replace(/^server\//, ''));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    
    // Set new profile image path
    const profileImagePath = `/uploads/profile/${req.file.filename}`;
    
    // Update user information
    user.profileImage = profileImagePath;
    await user.save();
    
    res.json({ 
      message: 'Profile image updated successfully',
      profileImage: profileImagePath
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  createAdmin,
  updateProfile,
  changePassword,
  uploadProfileImage
}; 