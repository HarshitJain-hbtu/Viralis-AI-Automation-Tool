interface ITokenPayload {
    userId: string;
    businessId: string;
    role: string;
}
export declare function signToken(payload: ITokenPayload): string;
export declare function verifyToken(token: string): ITokenPayload | null;
export {};
//# sourceMappingURL=jwt.d.ts.map