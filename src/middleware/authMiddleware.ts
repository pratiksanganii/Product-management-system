import { NextFunction, Request, Response } from 'express';
import { JWT_SECRET, STATUS_CODE } from '../common/commonService';
import jwt from 'jsonwebtoken';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token: any = req.headers?.access_token;
  if (!token)
    return {
      status: STATUS_CODE.ACCESS_DENIED,
      message: 'You can not perform that action.',
    };
  const data = jwt.verify(token, JWT_SECRET);
  console.log({ data });
}
