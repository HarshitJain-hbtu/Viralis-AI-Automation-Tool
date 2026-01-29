"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const business_controller_1 = require("../controllers/business.controller");
const router = (0, express_1.Router)();
// Public Brand Data (No Auth) - Used by Voice Microservice
router.get('/brand/:brandId', business_controller_1.BusinessController.getPublicProfile);
exports.default = router;
//# sourceMappingURL=public.routes.js.map