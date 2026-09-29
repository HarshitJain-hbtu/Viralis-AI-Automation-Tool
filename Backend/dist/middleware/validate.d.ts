import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
type Source = 'body' | 'query' | 'params';
/**
 * Returns middleware that validates a request segment against a Joi schema.
 * On success the sanitized value replaces the original (stripping unknown keys).
 * On failure it responds 400 with a list of messages.
 */
export declare function validate(schema: Joi.ObjectSchema, source?: Source): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export {};
//# sourceMappingURL=validate.d.ts.map