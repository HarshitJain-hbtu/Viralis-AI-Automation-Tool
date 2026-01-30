import { Router } from 'express';
import { LeadController } from '../controllers/lead.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * Protect all routes
 */
router.use(authMiddleware);

/**
 * GET /leads/analytics - Get all video analyses
 */
router.get('/analytics', LeadController.getVideoAnalyses);
router.get('/instagram-media', LeadController.getInstagramMedia);
router.post('/sync-instagram', LeadController.syncInstagramMedia);

/**
 * GET /leads/analyses/:id - Get specific analysis
 */
router.get('/analyses/:id', LeadController.getVideoAnalysis);

/**
 * Lead CRUD Routes
 */
router.get('/', LeadController.getLeads);
router.get('/:id', LeadController.getLeadById);
router.post('/', LeadController.createLead);
router.patch('/:id', LeadController.updateLead);
router.delete('/:id', LeadController.deleteLead);

/**
 * POST /leads/analyze - Analyze a specific video
 */
router.post('/analyze', LeadController.analyzeVideo);

export default router;
