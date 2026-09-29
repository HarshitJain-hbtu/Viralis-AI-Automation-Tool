import express from 'express';
import passport from '../config/passport';
import { youtubeCallback, facebookCallback, getSocialStats } from '../controllers/socialController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// Google/YouTube
router.get('/auth/youtube', (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        return res.redirect('/dashboard?error=google_oauth_not_configured');
    }
    const state = req.query.token as string; // We expect token to be passed as query param from frontend
    passport.authenticate('google', {
        scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.readonly', 'https://www.googleapis.com/auth/youtube.force-ssl'],
        state: state
    })(req, res, next);
});

router.get('/auth/youtube/callback', (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        return res.redirect('/dashboard?error=google_oauth_not_configured');
    }
    passport.authenticate('google', { session: false, failureRedirect: '/dashboard?error=auth_failed' })(req, res, () => {
        youtubeCallback(req, res, next);
    });
});

// Facebook
router.get('/auth/facebook', (req, res, next) => {
    const fbAppId = process.env.FACEBOOK_APP_ID || process.env.FB_APP_ID;
    const fbAppSecret = process.env.FACEBOOK_APP_SECRET || process.env.FB_APP_SECRET;
    if (!fbAppId || !fbAppSecret) {
        return res.redirect('/dashboard?error=facebook_oauth_not_configured');
    }
    const state = req.query.token as string;
    passport.authenticate('facebook', {
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
    passport.authenticate('facebook', { session: false, failureRedirect: '/dashboard?error=auth_failed' })(req, res, () => {
        facebookCallback(req, res, next);
    });
});

// Stats
router.get('/stats', authMiddleware, getSocialStats);

// Actions
router.post('/social/youtube/reply', authMiddleware, async (req, res) => {
    const { postYouTubeReply } = await import('../controllers/socialController');
    postYouTubeReply(req, res);
});

// Mock Routes (for testing/demo)
router.post('/auth/facebook/mock', authMiddleware, async (req, res) => {
    const { mockFacebookAuth } = await import('../controllers/socialController');
    mockFacebookAuth(req, res);
});

router.delete('/auth/disconnect/:provider', authMiddleware, async (req, res) => {
    const { disconnectSocial } = await import('../controllers/socialController');
    disconnectSocial(req, res);
});

export default router;
