import { Request, Response } from 'express';
declare abstract class UserController {
    static listAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static getOneById: (req: Request, res: Response) => Promise<void>;
    static editUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static deleteUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static search: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static upload: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
}
export default UserController;
