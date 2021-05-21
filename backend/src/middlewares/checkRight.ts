import {Request, Response, NextFunction} from 'express';
import User, {IUser} from '../model/user';
const ObjectId = require('mongoose').Types.ObjectId;

export const checkRight = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //Get the user ID from previous midleware
  const userId = res.locals.jwtPayload.userId;
  const ressourceId = req.params.id;

  if (!userId) return res.status(401).send();
  if (
    !ressourceId ||
    !ObjectId.isValid(userId) ||
    !ObjectId.isValid(ressourceId)
  )
    return res.status(400).send();
  try {
    const user: IUser | null = await User.findOne({
      $and: [{_id: userId}, {$or: [{'services._id': ressourceId}]}],
    }).exec();
    if (user && user._id.equals(userId)) return next();
  } catch (id) {
    return res.status(403).send();
  }
  return res.status(403).send();
};
