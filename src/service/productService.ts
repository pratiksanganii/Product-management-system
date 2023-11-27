import { NextFunction, Request, Response } from 'express';
import { STATUS_CODE, checkFilterParams } from '../common/commonService';

//#region add product
export async function addProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const fields = ['name', 'description', 'price', 'quantity'];
  const body = checkFilterParams(req.body, fields);
  // const vName = await validateName(body.name);
}
//#endregion

//#region validate if name already exist
//#endregion

//#region update product by specific product id
export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {}
//#endregion

//#region get product by specific id
export async function getProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {}
//#endregion

//#region delete specific product
export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {}
//#endregion
