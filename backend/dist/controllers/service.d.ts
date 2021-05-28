import { Request, Response } from 'express';
declare class ServiceController {
    static getById: (req: Request, res: Response) => Promise<void>;
    static updateById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static deleteById: (req: Request, res: Response) => Promise<void>;
    static create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static upload: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    static getRandom: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export default ServiceController;
