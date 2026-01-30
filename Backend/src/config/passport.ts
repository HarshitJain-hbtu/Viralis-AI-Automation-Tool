import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { User } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

// Serialize and deserialize user (not strictly needed for session: false but good practice)
passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/youtube/callback`,
            passReqToCallback: true,
        },
        async (_req, accessToken, refreshToken, profile, done) => {
            // We expect the user to be logged in and the JWT middleware to have attached the user to req.user
            // However, passport-google-oauth20 might not preserve req.user if session is false and we don't handle it carefully.
            // For connecting accounts, we usually pass a state parameter with the user's JWT or ID, or rely on a session cookie if available.
            // Since we are JWT based, we might need a workaround.
            // A common pattern for "Connect Account" is:
            // 1. Frontend sends JWT in "state" parameter.
            // 2. Callback decodes "state" to find user.

            // For now, we will return the tokens and profile, and handle the user update in the controller callback.
            return done(null, { profile, accessToken, refreshToken });
        }
    )
);

// Facebook Strategy
passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID || '',
            clientSecret: process.env.FACEBOOK_APP_SECRET || '',
            callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/facebook/callback`,
            passReqToCallback: true,
            profileFields: ['id', 'displayName', 'emails', 'photos'],
        },
        async (_req, accessToken, refreshToken, profile, done) => {
            return done(null, { profile, accessToken, refreshToken });
        }
    )
);

export default passport;
