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
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (googleClientId && googleClientSecret) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: googleClientId,
                clientSecret: googleClientSecret,
                callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/youtube/callback`,
                passReqToCallback: true,
            },
            async (_req, accessToken, refreshToken, profile, done) => {
                return done(null, { profile, accessToken, refreshToken });
            }
        )
    );
}

// Facebook Strategy
const fbAppId = process.env.FACEBOOK_APP_ID || process.env.FB_APP_ID;
const fbAppSecret = process.env.FACEBOOK_APP_SECRET || process.env.FB_APP_SECRET;

if (fbAppId && fbAppSecret) {
    passport.use(
        new FacebookStrategy(
            {
                clientID: fbAppId,
                clientSecret: fbAppSecret,
                callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/facebook/callback`,
                passReqToCallback: true,
                profileFields: ['id', 'displayName', 'emails', 'photos'],
            },
            async (_req, accessToken, refreshToken, profile, done) => {
                return done(null, { profile, accessToken, refreshToken });
            }
        )
    );
}

export default passport;
