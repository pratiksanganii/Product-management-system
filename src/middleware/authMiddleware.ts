import { NextFunction, Request, Response } from 'express';
import { JWT_SECRET, STATUS_CODE, missingField } from '../common/commonService';
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
  let data: any;
  try {
    data = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return res
      .status(STATUS_CODE.ACCESS_DENIED)
      .json({ message: 'Access token is not valid' });
  }
  if (!data || !data._id)
    return res
      .status(STATUS_CODE.ACCESS_DENIED)
      .json({ message: missingField('token') });
  const diff = new Date().getTime() / 1000 - +data?.iat;
  const maxDiff = 7 * 24 * 60 * 60;
  // admin need to login again after 7 days from login
  if (isNaN(diff) || diff > maxDiff)
    return res
      .status(STATUS_CODE.ACCESS_DENIED)
      .json({ message: 'Login again.' });
  req.body.adminId = data._id;
  req.query.adminId = data._id;
  next();
}
