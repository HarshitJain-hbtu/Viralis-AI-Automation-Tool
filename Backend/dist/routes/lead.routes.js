"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lead_controller_1 = require("../controllers/lead.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * Protect all routes
 */
router.use(auth_middleware_1.authMiddleware);
/**
 * GET /leads/analytics - Get all video analyses
 */
router.get('/analytics', lead_controller_1.LeadController.getVideoAnalyses);
router.get('/instagram-media', lead_controller_1.LeadController.getInstagramMedia);
router.post('/sync-instagram', lead_controller_1.LeadController.syncInstagramMedia);
/**
 * GET /leads/analyses/:id - Get specific analysis
 */
router.get('/analyses/:id', lead_controller_1.LeadController.getVideoAnalysis);
/**
 * Lead CRUD Routes
 */
router.get('/', lead_controller_1.LeadController.getLeads);
router.get('/:id', lead_controller_1.LeadController.getLeadById);
router.post('/', lead_controller_1.LeadController.createLead);
router.patch('/:id', lead_controller_1.LeadController.updateLead);
router.delete('/:id', lead_controller_1.LeadController.deleteLead);
/**
 * POST /leads/analyze - Analyze a specific video
 */
router.post('/analyze', lead_controller_1.LeadController.analyzeVideo);
exports.default = router;
//# sourceMappingURL=lead.routes.js.map