"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const business_controller_1 = require("../controllers/business.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware); // Protect all routes
router.get('/profile', business_controller_1.BusinessController.getProfile);
router.patch('/profile', business_controller_1.BusinessController.updateProfile);
exports.default = router;
//# sourceMappingURL=business.routes.js.map