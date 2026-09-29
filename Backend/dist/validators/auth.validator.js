"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
    name: joi_1.default.string().trim().min(1).max(120).required(),
    email: joi_1.default.string().trim().lowercase().email().required(),
    password: joi_1.default.string().min(6).max(128).required(),
    businessName: joi_1.default.string().trim().max(160).optional().allow(''),
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().trim().lowercase().email().required(),
    password: joi_1.default.string().required(),
});
exports.updateUserSchema = joi_1.default.object({
    name: joi_1.default.string().trim().min(1).max(120).optional(),
    avatar: joi_1.default.string().uri().max(2048).optional().allow(''),
}).min(1);
//# sourceMappingURL=auth.validator.js.map