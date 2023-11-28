import { NextFunction, Request, Response } from 'express';
import {
  JWT_SECRET,
  LoginType,
  NotFound,
  Regex,
  STATUS_CODE,
  SignUpType,
  checkFilterParams,
  eAlreadyExist,
} from '../common/commonService';
import db, { dbOptions } from '../database/mongo';
import { Admin } from '../database/models/Admin';
import { decryptText } from '../common/cryptService';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';

//#region sign up for new admin
export async function signUp(req: Request, res: Response, next: NextFunction) {
  try {
    const fields = ['name', 'email', 'password', 'confirmPassword'];
    const body = checkFilterParams(req.body, fields);
    const admin: any = await validateSignUp(body);
    if (admin?.status) {
      res.status(admin?.status);
      return next(admin?.message);
    }
    const create = await db.create(Admin, admin);
    const token = generateToken({ _id: create._id });
    await db.update(Admin, { filter: { _id: create._id }, update: { token } });
    // if all validations checked create new admin
    return res.json({ token, name: body.name, email: body.email });
  } catch (e) {
    return next({ status: STATUS_CODE.INT_ERR });
  }
}
//#endregion

//#region login for existing admins
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const fields = ['email', 'password'];
    const body = checkFilterParams(req.body, fields);
    // validate login email and password
    const vLogin = validateLogin(body);
    if (vLogin?.status) return vLogin;
    // check if email exist
    const options: dbOptions = {
      filter: { email: body.email },
      projection: { _id: true, email: true, password: true },
    };
    const find = await db.findOne(Admin, options);
    if (!find)
      return next({
        status: STATUS_CODE.NOT_FOUND,
        message: NotFound('Admin'),
      });

    // check if password is valid
    const password = decryptText(find.password);
    // if password does not match
    if (body.password !== password)
      return next({
        status: STATUS_CODE.BAD_REQ,
        message: 'Provide valid email and password.',
      });

    // if password verified generate token
    const token = generateToken(find);
    await db.update(Admin, { filter: { _id: find._id }, update: { token } });
    return res.json({ token, message: 'Login successful!' });
  } catch (e) {
    next({ status: STATUS_CODE.INT_ERR });
  }
}
//#endregion

//#region  validate email and password
function validateLogin(body: LoginType) {
  const status = STATUS_CODE.BAD_REQ;
  if (!Regex.Email.test(body.email))
    return { message: 'Email is not valid.', status };
  if (!Regex.Password.test(body.password))
    return { message: 'Password is not valid.', status };
}
//#endregion

//#region validate and prepare sign up
async function validateSignUp(body: SignUpType) {
  if (body.name.length < 3)
    return {
      message: 'Name must have atleast 3 characters.',
      status: STATUS_CODE.BAD_REQ,
    };
  // validate password before performing database action
  const vLogin = validateLogin(body);
  if (vLogin?.status) return vLogin;
  // check password with confirmPassword
  if (body.password !== body.confirmPassword)
    return {
      status: STATUS_CODE.BAD_REQ,
      message: 'password and confirm password must be same.',
    };
  // check in db for existing email
  const find = await db.findOne(Admin, {
    filter: { email: body.email },
    projection: ['email', 'password'],
  });
  if (find)
    return { status: STATUS_CODE.CONFLICT, message: eAlreadyExist('Admin') };
  return {
    name: body.name,
    password: body.password,
    email: body.email,
  };
}
//#endregion

//#region generate auth token for admin
function generateToken(admin: { _id: ObjectId }) {
  return jwt.sign({ _id: admin._id }, JWT_SECRET);
}
//#endregion
