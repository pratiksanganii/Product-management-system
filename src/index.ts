import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './database/db';
import productRouter from './routes/productRouter';
import adminRouter from './routes/adminRoutes';
import swaggerUi from 'swagger-ui-express';
import spec from './spec';
import { errorHandler } from './middleware/errorMiddleware';

async function initialize() {
  console.log('initialize');
  try {
    dotenv.config({ path: '.env' });
    const app = express();

    const PORT = process.env.PORT;
    await connectDB();
    app.use(express.json());
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
    // admin router setup
    app.use('/admin', adminRouter);

    // product router setup
    app.use('/product', productRouter);
    app.use('*', (req: Request, res: Response) =>
      res.status(404).json({ message: 'Not found.' })
    );
    app.use(errorHandler);
    console.log({ PORT });
    app.listen(PORT);
  } catch (e) {
    process.exit(1);
  }
}

// start application
initialize();
