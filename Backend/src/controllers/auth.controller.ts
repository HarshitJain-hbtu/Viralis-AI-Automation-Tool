import { Request, Response } from 'express';
import { User } from '../models/User';
import { Business } from '../models/Business';
import { signToken } from '../utils/jwt';
import logger from '../utils/logger';

export class AuthController {

    // Register a new user and business
    static async register(req: Request, res: Response) {
        try {
            const { email, password, name, businessName } = req.body;

            if (await User.findOne({ email })) {
                return res.status(400).json({ error: 'Email already exists' });
            }

            // 1. Create Business
            const business = await Business.create({
                name: businessName || `${name}'s Business`,
            });

            // 2. Create User linked to Business
            const user = await User.create({
                email,
                password, // Hashed by pre-save hook
                name,
                businessId: business._id,
                role: 'admin', // First user is admin
            });

            // 3. Generate Token
            const token = signToken({
                userId: user._id.toString(),
                businessId: business._id.toString(),
                role: user.role
            });

            return res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role, businessId: user.businessId } });
        } catch (error) {
            logger.error('Register error:', error);
            return res.status(500).json({ error: 'Registration failed' });
        }
    }

    // Login existing user
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email }).select('+password');
            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = signToken({
                userId: user._id.toString(),
                businessId: user.businessId.toString(),
                role: user.role
            });

            return res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role, businessId: user.businessId } });
        } catch (error) {
            logger.error('Login error:', error);
            return res.status(500).json({ error: 'Login failed' });
        }
    }

    // Get current user profile
    static async me(req: Request, res: Response) {
        try {
            const user = await User.findById(req.user?.userId).populate('businessId');
            if (!user) return res.status(404).json({ error: 'User not found' });
            return res.json(user);
        } catch (error) {
            return res.status(500).json({ error: 'Server error' });
        }
    }

    // Update user profile
    static async updateUser(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            const { name, avatar } = req.body;

            const user = await User.findByIdAndUpdate(
                userId,
                { $set: { name, avatar } },
                { new: true, runValidators: true }
            ).populate('businessId');

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.json(user);
        } catch (error) {
            logger.error('Update user error:', error);
            return res.status(500).json({ error: 'Failed to update profile' });
        }
    }
}
