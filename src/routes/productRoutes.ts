import express from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from '../controllers/productController';
import {createProductValidation, updateProductValidation} from '../validations/validations';
const router = express.Router();

router.post("/products", createProductValidation, createProduct);
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.patch('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;
