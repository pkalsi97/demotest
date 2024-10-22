const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                token: null,
                error: 'Email already exists'
            });
        }

        // Directly create user; password will be hashed in the User model
        const newUser = await User.create({ email, password });

        res.status(201).json({
            success: true,
            token: null,  // No token on registration
            error: "none",
            message: 'User registered successfully'
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            success: false,
            token: null,
            message: 'Registration Failed'
            error: 'Error registering user'
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                token: null,
                error: 'User not found'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                token: null,
                error: 'Invalid credentials'
            });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        res.json({
            success: true,
            token,
            error: null
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({
            success: false,
            token: null,
            error: 'Error logging in'
        });
    }
};

const logout = (req, res) => {
    res.json({
        success: true,
        token: null, // No token to return
        error: null,
        message: 'Logout successful'
    });
};

module.exports = { register, login, logout };
