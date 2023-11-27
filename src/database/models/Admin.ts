import { ObjectId, Schema, model } from 'mongoose';
import { encryptText } from '../../common/cryptService';

type AdminType = {
  _id: ObjectId;
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  token?: string;
};

const adminSchema = new Schema<AdminType>({
  name: { type: String, required: [true, 'name is required.'] },
  email: { type: String, required: [true, 'email is required.'] },
  password: { type: String, required: [true, 'password is required.'] },
  token: { type: String, required: false },
});

adminSchema.pre('save', function (next) {
  if (this.password) this.password = encryptText(this.password);
  next();
});

export const Admin = model<AdminType>('Admin', adminSchema);
