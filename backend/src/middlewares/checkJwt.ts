import {Request, Response, NextFunction} from 'express';
import * as jwt from 'jsonwebtoken';
import {ObjectID} from 'typeorm';
import config from '../config/config';

export interface TokenInterface {
  userId: ObjectID;
  email: string;
  iat: number;
  exp: number;
}

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the head
  const bearerHeader = <string>req.headers['authorization'];
  if (!bearerHeader)
    return res
      .status(401)
      .send({error: 'No Authorization found in the headers'});
  const token = bearerHeader.split(' ')[1];
  let jwtPayload: TokenInterface;

  //Try to validate the token and get data
  try {
    jwtPayload = <TokenInterface>jwt.verify(token, config.jwtSecret);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    return res.status(401).send();
  }

  //The token is valid for 1 hour
  //We want to send a new token on every request
  const {userId, email} = jwtPayload;
  const newToken = jwt.sign({userId, email}, config.jwtSecret, {
    expiresIn: '1h',
  });
  res.setHeader('token', newToken);

  //Call the next middleware or controller
  return next();
};
