import {
  FilterQuery,
  Model,
  ObjectId,
  ProjectionType,
  QueryOptions,
  Types,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose';

export type dbOptions = {
  filter: FilterQuery<any> | undefined;
  projection?: ProjectionType<any> | null | undefined;
  options?: QueryOptions<any> | undefined;
};
export type FindAllOpts = {
  filter: FilterQuery<any>;
  projection?: ProjectionType<any> | null | undefined;
  options?: QueryOptions<any> | undefined;
};

type UpdateOptions = {
  filter: FilterQuery<any> | undefined;
  update: UpdateWithAggregationPipeline | UpdateQuery<any> | undefined;
};

type FindIdOpts = {
  id: Types.ObjectId;
  projection: ProjectionType<any> | undefined;
  options?: QueryOptions<any> | undefined;
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

async function count(model: Model<any, {}, {}>, options: dbOptions) {
  return await model.countDocuments(options.filter, options.options);
}

async function update(model: Model<any, {}, {}>, options: UpdateOptions) {
  return await model.updateOne(options.filter, options.update);
}

async function findId(model: Model<any, {}, {}>, options: FindIdOpts) {
  return await model.findById(options.id, options.projection);
}

async function findAll(model: Model<any, {}, {}>, options: FindAllOpts) {
  return await model.find(options.filter, options.projection, options.options);
}

const db = { create, findOne, count, update, findId, findAll };
export default db;
