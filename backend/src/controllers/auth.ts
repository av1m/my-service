import {Request, Response} from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import User, {IUser} from '../model/user';

abstract class AuthController {
  static signJwt = (user: IUser) =>
    jwt.sign({userId: user.id, email: user.email}, config.jwtSecret, {
      expiresIn: '1h',
    });

  static register = async (req: Request, res: Response) => {
    //Get parameters from the body
    const user: IUser = new User(req.body);

    user.save(err => {
      if (err) return res.status(409).send(err);
      //If all ok, send 201 response
      return res
        .status(201)
        .send({token: AuthController.signJwt(user), user: user});
    });
  };

  static login = async (req: Request, res: Response) => {
    //Check if mail and password are set
    const dataUser: IUser = new User(req.body);
    if (!(dataUser.email && dataUser.password)) {
      return res.status(400).send();
    }

    //Get user from database
    const user = await User.findOne({email: dataUser.email});
    if (!user || !user.checkIfUnencryptedPasswordIsValid(dataUser.password)) {
      return res.status(401).send();
    }
    // Sign JWT
    const token = AuthController.signJwt(user);
    user.password = '';
    return res.status(200).send({token: token, user: user});
  };

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const {oldPassword, newPassword} = req.body;
    if (!(oldPassword && newPassword)) {
      return res.status(400).send();
    }

    //Get user from the database
    const user = await User.findById(id).exec();
    //Check if old password matchs
    if (!user || !user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      return res.status(403).send();
    }

    user.password = newPassword;
    try {
      await user.save();
    } catch (error) {
      return res.status(400).send(error);
    }
    return res.status(204).send();
  };
}
export default AuthController;
