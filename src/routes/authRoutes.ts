import express from 'express';
import { register, login, forgotPassword, resetPassword } from '../controllers/authController';
import {registerValidation, loginValidation, forgotPasswordValidation, resetPasswordValidation} from '../validations/validations';
const router = express.Router();

router.post('/register',registerValidation, register);
router.post("/login", loginValidation, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
