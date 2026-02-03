import { Request, Response, NextFunction } from 'express';
export declare const youtubeCallback: (req: Request, res: Response, _next: NextFunction) => Promise<void>;
export declare const facebookCallback: (req: Request, res: Response, _next: NextFunction) => Promise<void>;
export declare const mockFacebookAuth: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getSocialStats: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const postYouTubeReply: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const disconnectSocial: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=socialController.d.ts.map