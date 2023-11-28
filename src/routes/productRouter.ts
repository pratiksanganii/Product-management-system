import { Router } from 'express';
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
 *               productName:
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
 *       - name: access_token
 *         in: header
 *         description: access token
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Product added
 *       409:
 *         description: Product already exist
 */
productRouter.post('/add', addProduct);
/**
 * @swagger
 * /product/update:
 *   post:
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: product id to update
 *                 example: id for product
 *               productName:
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
 *       - name: access_token
 *         in: header
 *         description: access token
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Product added
 *       409:
 *         description: Product already exist
 */
productRouter.post('/update', updateProduct);

/**
 * @swagger
 * /product/get:
 *   get:
 *     parameters:
 *       - name: productId
 *         in: query
 *         type : string
 *         required: true
 *       - name: ownerId
 *         in: query
 *         type : string
 *         required: false
 *       - name: search
 *         in: query
 *         type : string
 *         required: false
 *       - name: minQty
 *         in: query
 *         type : string
 *         required: false
 *       - name: maxQty
 *         in: query
 *         type : string
 *         required: false
 *       - name: access_token
 *         in: header
 *         description: access token
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Product added
 */
productRouter.get('/get', getProduct);

/**
 * @swagger
 * /product/{productId}:
 *   delete:
 *     parameters:
 *       - name: productId
 *         in: path
 *         type : string
 *         required: true
 *       - name: access_token
 *         in: header
 *         description: access token
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Product added
 */
productRouter.delete('/:productId', deleteProduct);
export default productRouter;
