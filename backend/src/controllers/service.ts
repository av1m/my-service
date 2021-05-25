import User, {IUser} from '../model/user';
import Service, {IService} from '../model/service';
import {Request, Response} from 'express';
import {CallbackError} from 'mongoose';
import {unlinkSync} from 'fs';
const multer = require('multer');

class ServiceController {
  static getById = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id: string = req.params.id;
    const returnUserId: boolean =
      req.query.returnUserId?.toString().toLowerCase() === 'true';

    //Get the user from database
    await User.find(
      {
        'services._id': id,
      },
      {'services.$': 1},
      null,
      (err: CallbackError, result) => {
        return err || !result[0]
          ? res.status(404).send('Service not found')
          : res
              .status(200)
              .send(returnUserId ? result[0] : result[0]?.services);
      }
    ).exec();
    return;
  };

  static updateById = async (req: Request, res: Response) => {
    //Get the id user
    const userId = res.locals.jwtPayload.userId;
    // Check that the id is good!
    const serviceId: string = req.params.id;
    const user = await User.find({'services._id': serviceId}).exec();
    if (!user) return res.status(404).send('Service not found');
    const service: IService | undefined = user[0]?.services?.filter(
      (service: any) => service._id.toString() === serviceId
    )[0];
    if (!service) return res.status(404).send('Service not found');

    // Remove the old photo picture if the old picture is an uploaded picture
    if (!service.photo?.toLowerCase().startsWith('http') && req.body.photo) {
      try {
        unlinkSync('uploads/' + service.photo);
      } catch (err) {
        return res.status(500).send("Can't remove the old uploaded file");
      }
    }

    service.description = req.body.description ?? service.description;
    service.photo = req.body.photo ?? service.photo;
    service.name = req.body.name ?? service.name;
    service.price = req.body.price ?? service.price;
    service.tags = req.body.tags ?? service.tags;
    if (
      await User.findOneAndUpdate(
        {_id: userId, 'services._id': serviceId},
        {
          $set: {
            // Meaby... it dont work
            'services.$': service,
          },
        }
      ).exec()
    )
      return res.status(200).send();
    return res.status(400).send();
  };

  static deleteById = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    await User.updateOne({'services._id': id}, {$pull: {services: {_id: id}}})
      .then(result => {
        if (!result || result.nModified < 0) return res.status(406).send();
        //After all send a 204 (no content, but accepted) response
        return res.status(204).send();
      })
      .catch(() => res.status(406).send());
  };

  static create = async (req: Request, res: Response) => {
    //Get the id user
    const userId = res.locals.jwtPayload.userId;
    const {name, description, price, tags} = req.body;
    const user = await User.findById(userId).exec();
    const service = new Service();
    service.name = name;
    service.description = description;
    service.tags = tags;
    service.price = price;
    if (!user || user === undefined) {
      return res.status(404).send();
    }
    if ((user.services?.push(service) || 0) <= 0) {
      return res.status(500).send();
    }
    return await user
      .save()
      .then(user => {
        return res.status(201).send({service, user});
      })
      .catch(err => {
        return res.status(400).send(err);
      });
  };

  static upload = async (req: Request, res: Response) => {
    // Get the current user
    const userId: string = res.locals.jwtPayload.userId;
    // Check that the id is good!
    const serviceId: string = req.params.id;
    if (!(await User.find({'services._id': serviceId}).exec())) {
      return res.status(404).send('Service not found');
    }
    // Upload the file
    const storage = multer.diskStorage({
      destination: 'uploads/',
      filename: function (_req: any, _res: any, cb: any) {
        cb(null, serviceId);
      },
    });
    const upload = multer({
      storage: storage,
    }).single('image');
    upload(req, res, async (err: any) => {
      if (err) return res.status(500).send();
      const file = (req as any).file;
      if (!file?.mimetype.toLowerCase().startsWith('image')) {
        return res.status(415).send('Only image');
      }
      // Update the field photo
      await User.findOneAndUpdate(
        {_id: userId, 'services._id': serviceId},
        {
          $set: {
            // Meaby... it dont work
            'services.$.photo': file.filename,
          },
        }
      ).exec();
      return res.status(204).send();
    });
    return;
  };

  static getRandom = async (req: Request, res: Response) => {
    //Get the ID from the url
    let count: string | number = req.params.count;
    // Get the current user
    const userId: string = res.locals.jwtPayload.userId;
    try {
      count = Number.parseInt(count);
      if (count < 0) return res.status(400).send();
    } catch (error) {
      return res.status(400).send();
    }
    const users = (await User.aggregate([{$sample: {size: count}}])).filter(
      (user: IUser) =>
        (user!.services?.length || -1) > 0 && !user._id.equals(userId)
    );
    return res.status(200).json(users);
  };
}
export default ServiceController;
