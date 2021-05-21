import User from '../model/user';
import {Request, Response} from 'express';

class TagsController {
  static getAll = async (req: Request, res: Response) => {
    return res
      .status(200)
      .send({tags: await User.distinct('services.tags').exec()});
  };
}
export default TagsController;
