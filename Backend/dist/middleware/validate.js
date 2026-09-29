"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
/**
 * Returns middleware that validates a request segment against a Joi schema.
 * On success the sanitized value replaces the original (stripping unknown keys).
 * On failure it responds 400 with a list of messages.
 */
function validate(schema, source = 'body') {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[source], {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            return res.status(400).json({
                error: 'Validation failed',
                details: error.details.map((d) => d.message),
            });
        }
        req[source] = value;
        return next();
    };
}
//# sourceMappingURL=validate.js.map