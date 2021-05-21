import {Request, Response} from 'express';
import {CallbackError} from 'mongoose';
import User, {IUser} from '../model/user';
import {unlinkSync} from 'fs';
import multer = require('multer');

abstract class UserController {
  static listAll = async (req: Request, res: Response) => {
    //Get users from database
    const users = await User.find();

    //Send the users object
    return res.send(users);
  };

  static getOneById = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id: string = req.params.id;

    //Get the user from database
    User.findById(id, (err: CallbackError, user: IUser) => {
      return err
        ? res.status(404).send('User not found')
        : res.status(200).send(user);
    });
  };

  static editUser = async (req: Request, res: Response) => {
    // Get the ID from the url
    const id = req.params.id;

    // Get values from the body
    const {email, firstname, lastname, profile} = req.body;

    // Try to find user on database
    const user: IUser | null = await User.findById(id).exec();
    if (!user) return res.status(404).send();
    if (!user._id.equals(res.locals.jwtPayload.userId))
      return res.status(403).send();

    // Remove the old profile picture if the old profile picture is an uploaded picture
    if (!user.profile?.toLowerCase().startsWith('http') && profile) {
      try {
        unlinkSync('uploads/' + user.profile);
      } catch (err) {
        return res.status(500).send("Can't remove the old uploaded file");
      }
    }

    //Validate the new valuexs on model
    user.email = email ?? user.email;
    user.profile = profile ?? user.profile;
    user.firstname = firstname ?? user.firstname;
    user.lastname = lastname ?? user.lastname;

    try {
      user.save();
    } catch (e) {
      return res.status(409).send();
    }
    //After all send a 204 (no content, but accepted) response
    return res.status(204).send();
  };

  static deleteUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    const user = await User.findByIdAndDelete(id).exec();
    if (!user) return res.status(404).send();
    if (user._id.equals(res.locals.jwtPayload.userId))
      return res.status(403).send();

    //After all send a 204 (no content, but accepted) response
    return res.status(204).send();
  };

  static search = async (req: Request, res: Response) => {
    //Get the ID from the url
    const query = req.body.query;
    if (!query) return res.status(400).send("Missing 'query' params");

    const users = await User.find({$text: {$search: query}}).exec();
    return res.status(200).send(users);
  };

  static upload = async (req: Request, res: Response) => {
    // Get the current user
    const userId: string = res.locals.jwtPayload.userId;
    // Try to find user on database
    const user: IUser | null = await User.findById(userId).exec();
    if (!user) return res.status(404).send();
    if (!user._id.equals(res.locals.jwtPayload.userId))
      return res.status(403).send();

    // Upload the file
    const storage = multer.diskStorage({
      destination: 'uploads/',
      filename: function (_req: any, _res: any, cb: any) {
        cb(null, userId);
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
        {_id: userId},
        {
          $set: {
            profile: file.filename,
          },
        }
      ).exec();
      return res.status(204).send();
    });
    return;
  };
}

export default UserController;
