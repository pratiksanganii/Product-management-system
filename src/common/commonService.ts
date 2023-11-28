require('dotenv').config({ path: '.env' });

export function checkFilterParams(obj: any, include: string[]) {
  const temp: any = {};
  const status = STATUS_CODE.BAD_REQ;
  for (let k of include) {
    if (obj[k] == undefined || obj[k] == null)
      return { status, message: missingField(k) };
    temp[k] = obj[k];
  }
  return temp;
}

export function missingField(field: string) {
  return `${field} is required.`;
}

export function inValidField(field: string) {
  return `Provide valid ${field}.`;
}

export const COMMON_STATUS = {
  ACTIVE: 1,
  DE_ACTIVE: 0,
};
export const isDev = process.env.NODE_ENV == 'DEV';
export const CRYPT_KEY = process.env.CRYPT_KEY;
export const JWT_SECRET: any = process.env.JWT_SECRET;

// admin types
export type LoginType = { email: string; password: string };
export type SignUpType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
export const Regex = {
  Email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  Password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
};

export function eAlreadyExist(name: string) {
  return `${name} already exists.`;
}
export function NotFound(name: string) {
  return `${name} does not exist.`;
}

export const STATUS_CODE = {
  CONFLICT: 409,
  ACCESS_DENIED: 401,
  NOT_FOUND: 404,
  INT_ERR: 500,
  BAD_REQ: 400,
};
