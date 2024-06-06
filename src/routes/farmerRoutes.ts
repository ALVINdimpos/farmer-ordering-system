import express from 'express';
import { createFarmer, getAllFarmers, getFarmerById, updateFarmer, deleteFarmer } from '../controllers/farmerController';
import {createFarmerValidation, updateFarmerValidation} from '../validations/validations';
const router = express.Router();

router.post("/farmers", createFarmerValidation, createFarmer);
router.get('/farmers', getAllFarmers);
router.get('/farmers/:id', getFarmerById);
router.patch('/farmers/:id', updateFarmer);
router.delete('/farmers/:id', deleteFarmer);

export default router;
