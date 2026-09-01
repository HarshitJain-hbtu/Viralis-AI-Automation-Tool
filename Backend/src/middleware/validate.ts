import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

type Source = 'body' | 'query' | 'params';

/**
 * Returns middleware that validates a request segment against a Joi schema.
 * On success the sanitized value replaces the original (stripping unknown keys).
 * On failure it responds 400 with a list of messages.
 */
export function validate(schema: Joi.ObjectSchema, source: Source = 'body') {
    return (req: Request, res: Response, next: NextFunction) => {
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
