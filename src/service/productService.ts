import { NextFunction, Request, Response } from 'express';
import {
  COMMON_STATUS,
  STATUS_CODE,
  checkFilterParams,
  inValidField,
  missingField,
} from '../common/commonService';
import db from '../database/mongo';
import { Product } from '../database/models/Product';
import { ObjectId, Types } from 'mongoose';
import { Admin } from '../database/models/Admin';

//#region add product
export async function addProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const fields = [
      'productName',
      'description',
      'price',
      'quantity',
      'adminId',
    ];
    const body = checkFilterParams(req.body, fields);
    if (body?.message) return next(body);
    // validate product details
    const valid: any = checkProductDetail(body);
    if (valid?.message)
      return res.status(valid.status).json({ message: valid?.message });
    valid.adminId = new Types.ObjectId(req.body.adminId);
    // validate same name product does not exist
    const vName = await validateName(valid.productName);
    if (vName?.status)
      return res.status(vName.status).json({ message: vName?.message });
    const data = await db.create(Product, valid);
    return res.status(200).json({ data });
  } catch (e) {
    return next({ status: STATUS_CODE.INT_ERR });
  }
}
//#endregion

//#region validate if name already exist
async function validateName(productName: string) {
  const count = await db.count(Product, { filter: { productName } });
  if (count)
    return { status: STATUS_CODE.CONFLICT, message: 'Product already exist.' };
}
//#endregion

type UpdateType = {
  productName?: string;
  description?: string;
  price?: number;
  quantity?: number;
  status?: typeof COMMON_STATUS.ACTIVE | typeof COMMON_STATUS.DE_ACTIVE;
  image?: string;
};

//#region validate product detail
function checkProductDetail(product: UpdateType) {
  let update: UpdateType = {};
  const status = STATUS_CODE.BAD_REQ;
  if (product?.productName)
    if (product?.productName?.length < 3 || product?.productName?.length > 200)
      return {
        status,
        message: inValidField('productName'),
      };
    else update.productName = product.productName.toLowerCase();
  if (product?.description)
    if (product?.description?.length < 3 || product?.description?.length > 300)
      return {
        status: STATUS_CODE.BAD_REQ,
        message: inValidField('description'),
      };
    else update.description = product.description.toLowerCase();
  if (product?.price)
    if (isNaN(+product.price))
      return {
        status: STATUS_CODE.BAD_REQ,
        message: inValidField('price'),
      };
    else update.price = product.price;
  if (product?.quantity)
    if (isNaN(+product.quantity))
      return {
        status: STATUS_CODE.BAD_REQ,
        message: inValidField('price'),
      };
    else update.quantity = product.quantity;
  if (product?.status)
    if (product.status in COMMON_STATUS) update.status = product.status;
    else
      return { status: STATUS_CODE.BAD_REQ, message: inValidField('status') };
  if (product?.image)
    if (product?.image?.length < 3 || product?.image?.length > 300)
      return {
        status: STATUS_CODE.BAD_REQ,
        message: inValidField('description'),
      };
    else update.description = product.image;
  return update;
}
//#endregion

//#region update product by specific product id
export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // validate required params
    const body = checkFilterParams(req.body, ['adminId', 'productId']);
    if (body?.status) next(body);
    // prepare update data
    const valid: any = checkProductDetail(req.body);
    if (valid?.message)
      return res.status(valid?.status).json({ message: valid?.message });
    const keys = Object.keys(valid);
    if (!keys.length)
      return res
        .status(STATUS_CODE.BAD_REQ)
        .json({ message: 'product data is required.' });
    const projection: any = { adminId: true };
    keys.forEach((k) => (projection[k] = true));
    // get product old data
    const productId = new Types.ObjectId(body.productId);
    const find = await db.findId(Product, {
      id: body.productId,
      projection,
    });
    if (!find)
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json({ message: 'Product not found.' });
    // check if admin is owner of the product
    if (find.adminId != body.adminId)
      return res
        .status(STATUS_CODE.ACCESS_DENIED)
        .json({ message: 'You are not owner of that product.' });
    // update data
    const data = await db.update(Product, {
      filter: { _id: productId },
      update: valid,
    });
    return res.json({ data });
  } catch (e) {
    return next({ status: STATUS_CODE.INT_ERR });
  }
}
//#endregion

//#region get product by specific id
export async function getProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (typeof req.query.adminId != 'string')
      return next({
        status: STATUS_CODE.BAD_REQ,
        message: missingField('adminId'),
      });
    const filter = getProductFilter(req.query);
    if (filter?.status)
      return res
        .status(filter.status)
        .json({ message: 'provide valid filter' });
    const data: any = await db.findAll(Product, {
      filter,
      projection: {
        productName: true,
        description: true,
        price: true,
        quantity: true,
        image: true,
        isDeleted: true,
        adminId: true,
      },
    });
    const adminIds = data.map((d: any) => new Types.ObjectId(d.adminId));
    const admins: any = await getAdminNameById(adminIds);
    if (admins?.status) return next(admins);
    data.forEach((d: any) => {
      const Owner = admins.find((a: any) => a._id.equals(d.adminId))?.name;
      d._doc.Owner = Owner;
    });
    // get admin name
    return res.json({ data });
  } catch (e) {
    return next({ status: STATUS_CODE.INT_ERR });
  }
}
//#endregion

//#region get product filter
function getProductFilter(query: any) {
  try {
    const filter: any = {};
    if (query?.ownerId) filter.adminId = new Types.ObjectId(query.ownerId);
    if (query?.productId) filter._id = new Types.ObjectId(query.productId);
    if (query?.search?.length >= 3)
      filter.productName = { $regex: query.search };
    if ('isDeleted' in query) filter.isDeleted = { isDeleted: query.isDeleted };
    const min = +query?.minQty;
    const max = +query?.maxQty;
    if (!isNaN(min) && !isNaN(max)) filter.quantity = { $gte: min, $lte: max };
    return filter;
  } catch (e) {
    return { status: STATUS_CODE.INT_ERR };
  }
}
//#endregion

//#region get admin name by id
async function getAdminNameById(_id: ObjectId[]) {
  const admin = await db.findAll(Admin, {
    filter: { _id: { $in: _id } },
    projection: { name: true },
  });
  if (!admin)
    return { status: STATUS_CODE.NOT_FOUND, message: 'Admin not found.' };
  return admin;
}
//#endregion

//#region delete specific product
export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (
      typeof req.params.productId != 'string' ||
      typeof req.body.adminId != 'string'
    )
      return next({
        status: STATUS_CODE.BAD_REQ,
        message: missingField('productId'),
      });
    const id = new Types.ObjectId(req.params.productId);
    const find = await db.findId(Product, {
      id,
      projection: { adminId: true },
    });
    if (!find)
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json({ message: 'Product not found.' });
    // check if admin is owner of the product
    if (find.adminId != req.body.adminId)
      return res
        .status(STATUS_CODE.ACCESS_DENIED)
        .json({ message: 'You are not owner of that product.' });
    const _id = new Types.ObjectId(req.params.productId);
    const data = await db.update(Product, {
      filter: { _id },
      update: { isDeleted: COMMON_STATUS.ACTIVE },
    });
    return res.json({ data });
  } catch (e) {
    return next({ status: STATUS_CODE.INT_ERR });
  }
}
//#endregion
