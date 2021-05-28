import { Request, Response, NextFunction } from 'express';
import { ObjectID } from 'mongodb';
export interface TokenInterface {
    userId: ObjectID;
    email: string;
    iat: number;
    exp: number;
}
export declare const checkJwt: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
