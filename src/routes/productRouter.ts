import { Router } from 'express';
import { errorHandler } from '../middleware/errorMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  addProduct,
  deleteProduct,
  getProduct,
  updateProduct,
} from '../service/productService';
const productRouter = Router();

// verify admin identity
productRouter.use(authMiddleware);
/**
 * @swagger
 * /product/add:
 *   post:
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The product's name.
 *                 example: Macbook
 *               description:
 *                 type: string
 *                 description: description.
 *                 example: This is Macbook description.
 *               price:
 *                 type: number
 *                 description: price of product.
 *                 example: 100000.
 *               quantity:
 *                 type: number
 *                 description: quantity of product.
 *                 example: 10.
 *     parameters:
 *     responses:
 *       200:
 *         description: Product added
 */
productRouter.post('/add', addProduct);

productRouter.post('/update/:_id', updateProduct);
productRouter.get('/', getProduct);
productRouter.delete('/:_id', deleteProduct);

// handle errors
productRouter.use(errorHandler);
export default productRouter;
