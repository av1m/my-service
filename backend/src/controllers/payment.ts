import User, {IUser} from '../model/user';
import {Request, Response} from 'express';

class PaymentController {
  static add = async (req: Request, res: Response) => {
    // Get values from the body
    const {id} = req.body;
    if (!id) return res.status(400).send('serviceId is missing');

    // Try to find user on database
    const user: IUser | null = await User.findById(
      res.locals.jwtPayload.userId
    ).exec();
    if (!user) return res.status(404).send();
    if (!user._id.equals(res.locals.jwtPayload.userId))
      return res.status(403).send();

    // Try to find the service in database
    const userService = await User.findOne({'services._id': id}).exec();
    if (!userService) return res.status(404).send('Service not found');
    if (userService._id.equals(user._id))
      return res.status(400).send("Can't subscribe in his own service");

    if (user.payments?.indexOf(id) === -1) {
      user.payments?.push(id);
      user.save(err => {
        if (err) return res.status(409).send(err);
        //If all ok, send 201 response
        return res.status(200).send();
      });
    }
    return;
  };
  static get = async (req: Request, res: Response) => {
    const user: IUser | null = await User.findById(
      res.locals.jwtPayload.userId
    ).exec();
    if (!user) return res.status(404).send();
    const users = await User.find({
      'services._id': {$in: user.payments || []},
    }).exec();
    if (!users) return res.status(200).send();
    // Deletes all services that are not in User.payments
    const usersFiltered = users.map(u => ({
      ...u.toObject(),
      services: u.services?.filter(s => user.payments?.includes(s._id)),
    }));
    return res.status(200).send(usersFiltered);
  };
}
export default PaymentController;
