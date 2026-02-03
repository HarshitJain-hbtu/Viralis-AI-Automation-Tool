"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = require("../models/User");
const Business_1 = require("../models/Business");
const jwt_1 = require("../utils/jwt");
const logger_1 = __importDefault(require("../utils/logger"));
class AuthController {
    // Register a new user and business
    static async register(req, res) {
        try {
            const { email, password, name, businessName } = req.body;
            if (await User_1.User.findOne({ email })) {
                return res.status(400).json({ error: 'Email already exists' });
            }
            // 1. Create Business
            const business = await Business_1.Business.create({
                name: businessName || `${name}'s Business`,
            });
            // 2. Create User linked to Business
            const user = await User_1.User.create({
                email,
                password, // Hashed by pre-save hook
                name,
                businessId: business._id,
                role: 'admin', // First user is admin
            });
            // 3. Generate Token
            const token = (0, jwt_1.signToken)({
                userId: user._id.toString(),
                businessId: business._id.toString(),
                role: user.role
            });
            return res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role, businessId: user.businessId } });
        }
        catch (error) {
            logger_1.default.error('Register error:', error);
            return res.status(500).json({ error: 'Registration failed' });
        }
    }
    // Login existing user
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User_1.User.findOne({ email }).select('+password');
            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const token = (0, jwt_1.signToken)({
                userId: user._id.toString(),
                businessId: user.businessId.toString(),
                role: user.role
            });
            return res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role, businessId: user.businessId } });
        }
        catch (error) {
            logger_1.default.error('Login error:', error);
            return res.status(500).json({ error: 'Login failed' });
        }
    }
    // Get current user profile
    static async me(req, res) {
        try {
            const user = await User_1.User.findById(req.user?.userId).populate('businessId');
            if (!user)
                return res.status(404).json({ error: 'User not found' });
            return res.json(user);
        }
        catch (error) {
            return res.status(500).json({ error: 'Server error' });
        }
    }
    // Update user profile
    static async updateUser(req, res) {
        try {
            const userId = req.user?.userId;
            const { name, avatar } = req.body;
            const user = await User_1.User.findByIdAndUpdate(userId, { $set: { name, avatar } }, { new: true, runValidators: true }).populate('businessId');
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.json(user);
        }
        catch (error) {
            logger_1.default.error('Update user error:', error);
            return res.status(500).json({ error: 'Failed to update profile' });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map