import { Router } from 'express';
import { login, signUp } from '../service/adminService';
const adminRouter = Router();

// create admin
/**
 * @swagger
 * /admin/signUp:
 *   post:
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The admin's name.
 *                 example: Pratik Sangani
 *               email:
 *                 type: string
 *                 description: The admin's email.
 *                 example: pratik@sangani.com
 *               password:
 *                 type: string
 *                 description: password.
 *                 example: Pratik#Pass1
 *               confirmPassword:
 *                 type: string
 *                 description: confirm your password.
 *                 example: Pratik#Pass1
 *     responses:
 *       200:
 *         description: ok
 *       409:
 *         description: Admin already exist
 */
adminRouter.post('/signUp', signUp);

// admin login
/**
 * @swagger
 * /admin/login:
 *   post:
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The admin's email.
 *                 example: pratik@sangani.com
 *               password:
 *                 type: string
 *                 description: password.
 *                 example: Pratik#Pass1
 *     responses:
 *       200:
 *         description: login successful
 */
adminRouter.post('/login', login);

export default adminRouter;
