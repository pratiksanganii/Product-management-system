import { Request, Response } from 'express';

export function errorHandler(error: any, req: Request, res: Response) {
  const status: number = typeof res.status == 'number' ? +res.status : 500;
  return res.json({ message: error ?? 'Internal error' }).status(status);
}
