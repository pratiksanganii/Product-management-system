import { ObjectId, Schema, SchemaTypes, model } from 'mongoose';
import { COMMON_STATUS, missingField } from '../../common/commonService';

const { ACTIVE, DE_ACTIVE } = COMMON_STATUS;
type ProductType = {
  _id?: ObjectId;
  productName: string;
  description?: string;
  price: number;
  quantity: number;
  isDeleted: typeof ACTIVE | typeof DE_ACTIVE;
  image?: string;
  adminId?: ObjectId;
};

const productSchema = new Schema<ProductType>({
  // product's name
  productName: {
    type: String,
    lowerCase: true,
    minLength: 3,
    maxLength: 250,
    required: [true, missingField('product name')],
  },
  description: { type: String, lowerCase: true, minLength: 3, maxLength: 250 },
  price: { type: Number, required: [true, missingField('price')] },
  quantity: { type: Number, required: [true, missingField('quantity')] },
  // status wil be used for considering if product is deleted or not
  isDeleted: {
    type: Number,
    enum: [ACTIVE, DE_ACTIVE],
    default: ACTIVE,
  },
  image: { type: String },
  adminId: {
    type: SchemaTypes.ObjectId,
    ref: 'Admin',
    required: [true, missingField('adminId')],
  },
});

export const Product = model<ProductType>('Product', productSchema);
