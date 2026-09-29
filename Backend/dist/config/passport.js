"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const User_1 = require("../models/User");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Serialize and deserialize user (not strictly needed for session: false but good practice)
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await User_1.User.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
});
// Google Strategy
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (googleClientId && googleClientSecret) {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/youtube/callback`,
        passReqToCallback: true,
    }, async (_req, accessToken, refreshToken, profile, done) => {
        return done(null, { profile, accessToken, refreshToken });
    }));
}
// Facebook Strategy
const fbAppId = process.env.FACEBOOK_APP_ID || process.env.FB_APP_ID;
const fbAppSecret = process.env.FACEBOOK_APP_SECRET || process.env.FB_APP_SECRET;
if (fbAppId && fbAppSecret) {
    passport_1.default.use(new passport_facebook_1.Strategy({
        clientID: fbAppId,
        clientSecret: fbAppSecret,
        callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/facebook/callback`,
        passReqToCallback: true,
        profileFields: ['id', 'displayName', 'emails', 'photos'],
    }, async (_req, accessToken, refreshToken, profile, done) => {
        return done(null, { profile, accessToken, refreshToken });
    }));
}
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map