"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_1 = require("../middleware/validate");
const rateLimiter_1 = require("../middleware/rateLimiter");
const auth_validator_1 = require("../validators/auth.validator");
const router = (0, express_1.Router)();
router.post('/register', rateLimiter_1.authLimiter, (0, validate_1.validate)(auth_validator_1.registerSchema), auth_controller_1.AuthController.register);
router.post('/login', rateLimiter_1.authLimiter, (0, validate_1.validate)(auth_validator_1.loginSchema), auth_controller_1.AuthController.login);
router.get('/me', auth_middleware_1.authMiddleware, auth_controller_1.AuthController.me);
router.patch('/me', auth_middleware_1.authMiddleware, (0, validate_1.validate)(auth_validator_1.updateUserSchema), auth_controller_1.AuthController.updateUser);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map