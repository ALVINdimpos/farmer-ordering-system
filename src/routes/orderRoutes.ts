import express from 'express';
import { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder } from '../controllers/orderController';
import {createOrderValidation, updateOrderValidation} from '../validations/validations';
const router = express.Router();

router.post("/orders", createOrderValidation, createOrder);
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.patch('/orders/:id', updateOrder);
router.delete('/orders/:id', deleteOrder);

export default router;
