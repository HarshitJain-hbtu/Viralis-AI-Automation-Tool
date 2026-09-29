import { WebSocket } from 'ws';
import { Request } from 'express';
export declare const handleWebConnection: (ws: WebSocket, req: Request) => Promise<void>;
/**
 * REST Endpoint for Voice Receptionist Chat Messages
 * Provides an instant fallback if WebSockets are blocked by proxies or browser policies
 */
export declare const handleVoiceChatMessage: (req: Request, res: any) => Promise<any>;
//# sourceMappingURL=webCallController.d.ts.map