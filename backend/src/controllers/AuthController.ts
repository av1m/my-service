import {Request, Response} from 'express';
import * as jwt from 'jsonwebtoken';
import {getRepository} from 'typeorm';
import {validate} from 'class-validator';

import {User, UserRole} from '../entity/User';
import config from '../config/config';

class AuthController {
  static register = async (req: Request, res: Response) => {
    //Get parameters from the body
    const {email, password} = req.body;
    const user = new User();
    user.email = email;
    user.password = password;
    user.role = UserRole.EDITOR;

    //Validade if the parameters are ok
    const errors = await validate(user);
    console.log(errors);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    //Hash the password, to securely store on DB
    user.hashPassword();

    //Try to save. If fails, the mail is already in use
    const userRepository = getRepository(User);
    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send({error: 'mail already in use'});
      return;
    }

    //If all ok, send 201 response
    res.status(201).send({success: 'User created'});
  };

  static login = async (req: Request, res: Response) => {
    //Check if mail and password are set
    const {email, password} = req.body;
    if (!(email && password)) {
      res.status(400).send();
    }

    //Get user from database
    const userRepository = getRepository(User);
    let user: User | undefined = undefined;
    try {
      user = await userRepository.findOneOrFail({where: {email: email}});
    } catch (error) {
      res.status(401).send();
    }

    if (!user || !user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send();
      return;
    }

    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
      {userId: user.id, email: user.email},
      config.jwtSecret,
      {expiresIn: '1h'}
    );

    //Send the jwt in the response
    res.send({token: token});
  };

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const {oldPassword, newPassword} = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    //Get user from the database
    const userRepository = getRepository(User);
    let user: User | undefined = undefined;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    //Check if old password matchs
    if (!user || !user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();
      return;
    }

    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(204).send();
  };
}
export default AuthController;
