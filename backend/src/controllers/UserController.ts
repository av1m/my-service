import {Request, Response} from 'express';
import {getRepository} from 'typeorm';
import {validate} from 'class-validator';

import {User} from '../entity/User';

abstract class UserController {
  static listAll = async (req: Request, res: Response) => {
    //Get users from database
    const userRepository = getRepository(User);
    const users = await userRepository.find();

    //Send the users object
    return res.send(users);
  };

  static getOneById = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id: string = req.params.id;

    //Get the user from database
    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOneOrFail(id);
      return res.status(200).send(user);
    } catch (error) {
      return res.status(404).send('User not found');
    }
  };

  static newUser = async (req: Request, res: Response) => {
    //Get parameters from the body
    const {email, password, role} = req.body;
    const user = new User();
    user.email = email;
    user.password = password;
    user.role = role;

    //Validade if the parameters are ok
    const errors = await validate(user);
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
      return res.status(409).send('mail already in use');
    }

    //If all ok, send 201 response
    return res.status(201).send('User created');
  };

  static editUser = async (req: Request, res: Response) => {
    // Get the ID from the url
    const id = req.params.id;

    // Get values from the body
    const {email, role, notes, firstname, lastname} = req.body;

    // Try to find user on database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      //If not found, send a 404 response
      return res.status(404).send('User not found');
    }

    //Validate the new valuexs on model
    user.email = email ?? user.email;
    user.role = role ?? user.role;
    user.notes = notes ?? user.notes;
    user.firstname = firstname ?? user.firstname;
    user.lastname = lastname ?? user.lastname;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    //Try to safe, if fails, that means mail already in use
    try {
      await userRepository.save(user);
    } catch (e) {
      return res.status(409).send('mail already in use');
    }
    //After all send a 204 (no content, but accepted) response
    return res.status(204).send();
  };

  static deleteUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    const userRepository = getRepository(User);
    try {
      await userRepository.findOneOrFail(id);
    } catch (error) {
      return res.status(404).send('User not found');
    }
    userRepository.delete(id);

    //After all send a 204 (no content, but accepted) response
    return res.status(204).send();
  };
}

export default UserController;
