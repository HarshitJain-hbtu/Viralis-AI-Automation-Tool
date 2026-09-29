"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("../config/passport"));
const socialController_1 = require("../controllers/socialController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Google/YouTube
router.get('/auth/youtube', (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        return res.redirect('/dashboard?error=google_oauth_not_configured');
    }
    const state = req.query.token; // We expect token to be passed as query param from frontend
    passport_1.default.authenticate('google', {
        scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.readonly', 'https://www.googleapis.com/auth/youtube.force-ssl'],
        state: state
    })(req, res, next);
});
router.get('/auth/youtube/callback', (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        return res.redirect('/dashboard?error=google_oauth_not_configured');
    }
    passport_1.default.authenticate('google', { session: false, failureRedirect: '/dashboard?error=auth_failed' })(req, res, () => {
        (0, socialController_1.youtubeCallback)(req, res, next);
    });
});
// Facebook
router.get('/auth/facebook', (req, res, next) => {
    const fbAppId = process.env.FACEBOOK_APP_ID || process.env.FB_APP_ID;
    const fbAppSecret = process.env.FACEBOOK_APP_SECRET || process.env.FB_APP_SECRET;
    if (!fbAppId || !fbAppSecret) {
        return res.redirect('/dashboard?error=facebook_oauth_not_configured');
    }
    const state = req.query.token;
    passport_1.default.authenticate('facebook', {
        scope: ['email', 'public_profile'],
        state: state
    })(req, res, next);
});
router.get('/auth/facebook/callback', (req, res, next) => {
    const fbAppId = process.env.FACEBOOK_APP_ID || process.env.FB_APP_ID;
    const fbAppSecret = process.env.FACEBOOK_APP_SECRET || process.env.FB_APP_SECRET;
    if (!fbAppId || !fbAppSecret) {
        return res.redirect('/dashboard?error=facebook_oauth_not_configured');
    }
    passport_1.default.authenticate('facebook', { session: false, failureRedirect: '/dashboard?error=auth_failed' })(req, res, () => {
        (0, socialController_1.facebookCallback)(req, res, next);
    });
});
// Stats
router.get('/stats', auth_middleware_1.authMiddleware, socialController_1.getSocialStats);
// Actions
router.post('/social/youtube/reply', auth_middleware_1.authMiddleware, async (req, res) => {
    const { postYouTubeReply } = await Promise.resolve().then(() => __importStar(require('../controllers/socialController')));
    postYouTubeReply(req, res);
});
// Mock Routes (for testing/demo)
router.post('/auth/facebook/mock', auth_middleware_1.authMiddleware, async (req, res) => {
    const { mockFacebookAuth } = await Promise.resolve().then(() => __importStar(require('../controllers/socialController')));
    mockFacebookAuth(req, res);
});
router.delete('/auth/disconnect/:provider', auth_middleware_1.authMiddleware, async (req, res) => {
    const { disconnectSocial } = await Promise.resolve().then(() => __importStar(require('../controllers/socialController')));
    disconnectSocial(req, res);
});
exports.default = router;
//# sourceMappingURL=socialRoutes.js.map