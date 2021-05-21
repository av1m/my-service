import {Request, Response, NextFunction} from 'express';
const ObjectId = require('mongoose').Types.ObjectId;

export const checkObjectId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  return ObjectId.isValid(id) ? next() : res.status(400).send('Invalid ID');
};
