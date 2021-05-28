import { Request, Response } from 'express';
import { IUser } from '../model/user';
declare abstract class AuthController {
    static signJwt: (user: IUser) => string;
    static register: (req: Request, res: Response) => Promise<void>;
    static login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static changePassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export default AuthController;
