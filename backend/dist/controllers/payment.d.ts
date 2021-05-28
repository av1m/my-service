import { Request, Response } from 'express';
declare class PaymentController {
    static add: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    static get: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export default PaymentController;
