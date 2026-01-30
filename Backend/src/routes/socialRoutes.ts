import express from 'express';
import passport from '../config/passport';
import { youtubeCallback, facebookCallback, getSocialStats } from '../controllers/socialController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// Google/YouTube
router.get('/auth/youtube', (req, res, next) => {
    const state = req.query.token as string; // We expect token to be passed as query param from frontend
    passport.authenticate('google', {
        scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.readonly', 'https://www.googleapis.com/auth/youtube.force-ssl'],
        state: state
    })(req, res, next);
});

router.get('/auth/youtube/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/dashboard?error=auth_failed' }),
    youtubeCallback
);

// Facebook
router.get('/auth/facebook', (req, res, next) => {
    const state = req.query.token as string;
    passport.authenticate('facebook', {
        scope: ['email', 'public_profile'],
        state: state
    })(req, res, next);
});

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { session: false, failureRedirect: '/dashboard?error=auth_failed' }),
    facebookCallback
);

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
