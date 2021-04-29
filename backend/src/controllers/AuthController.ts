import {Request, Response} from 'express';
import * as jwt from 'jsonwebtoken';
import {getRepository} from 'typeorm';
import {validate} from 'class-validator';

import {User, UserRole} from '../entity/User';
import config from '../config/config';

abstract class AuthController {
  static register = async (req: Request, res: Response) => {
    //Get parameters from the body
    const {email, password, firstname, lastname} = req.body;
    const user = new User();
    user.email = email.toLowerCase();
    user.password = password;
    user.role = UserRole.EDITOR;
    user.firstname = firstname;
    user.lastname = lastname;

    //Validade if the parameters are ok
    const errors = await validate(user);
    console.log(errors);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    //Hash the password, to securely store on DB
    user.hashPassword();

    //Try to save. If fails, the mail is already in use
    const userRepository = getRepository(User);
    try {
      await userRepository.save(user);
    } catch (e) {
      return res.status(409).send({error: 'mail already in use'});
    }

    //If all ok, send 201 response
    return res.status(201).send({success: 'User created'});
  };

  static login = async (req: Request, res: Response) => {
    //Check if mail and password are set
    const {email, password} = req.body;
    if (!(email && password)) {
      return res.status(400).send();
    }

    //Get user from database
    const userRepository = getRepository(User);
    let user: User | undefined = undefined;
    try {
      user = await userRepository.findOneOrFail({
        where: {email: email.toLowerCase()},
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send();
    }

    if (!user || !user.checkIfUnencryptedPasswordIsValid(password)) {
      return res.status(401).send('Invalid password!');
    }

    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
      {userId: user.id, email: user.email},
      config.jwtSecret,
      {expiresIn: '1h'}
    );

    // Give that we return the user, we delete the password
    user.password = '';

    //Send the jwt in the response
    return res.send({token: token, user: user});
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
    const userRepository = getRepository(User);
    let user: User | undefined = undefined;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      return res.status(401).send();
    }

    //Check if old password matchs
    if (!user || !user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      return res.status(401).send();
    }

    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }
    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    return res.status(204).send();
  };
}
export default AuthController;
