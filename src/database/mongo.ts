import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';

export type dbOptions = {
  filter: FilterQuery<any> | undefined;
  projection?: ProjectionType<any> | null | undefined;
  options?: QueryOptions<any> | null | undefined;
};

async function create(model: Model<any, {}, {}>, data: any) {
  return await model.create(data);
}
async function findOne(model: Model<any, {}, {}>, options: dbOptions) {
  return await model.findOne(
    options.filter,
    options.projection,
    options.options
  );
}

const db = { create, findOne };
export default db;
