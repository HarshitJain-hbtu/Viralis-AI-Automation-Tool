import { Request, Response } from 'express';
export declare class BusinessController {
    static getProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static updateProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getPublicProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static seedDatabase(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=business.controller.d.ts.map