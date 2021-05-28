import { Request, Response } from 'express';
declare class TagsController {
    static getAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export default TagsController;
