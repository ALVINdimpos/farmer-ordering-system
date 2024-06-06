import Farmer from "../models/Farmer";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import logger from "../../logs/logger";
// Create a new Farmer

export const createFarmer = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error("Create Farmer : Error in create farmer validation", {
      errors: errors.array(),
    });
    return res.status(400).json({ errors: errors.array() });
  }
  const { userId, landSize, cropTypes } = req.body;
  try {
    const newFarmer = new Farmer({
      user: userId,
      landSize,
      cropTypes,
    });
    await newFarmer.save();

    // Populate the 'user' field before sending the response
    const populatedFarmer = await Farmer.findById(newFarmer._id).populate('user', 'username email -_id');  

    logger.info("Create Farmer : New farmer created successfully");
    res.status(201).json({
      message: "Farmer created successfully",
      farmer: populatedFarmer  // This now includes user details
    });
  } catch (error) {
    logger.error("Create Farmer : Error in creating farmer", { error });
    res.status(500).send("Error creating the farmer");
  }
};

// Get all Farmers with user details
export const getAllFarmers = async (req: Request, res: Response) => {
  try {
    // Use populate to include user details in the response
    const farmers = await Farmer.find().populate('user', 'username email -_id');  // Select fields you need from the User model
    res.status(200).json(farmers);
  } catch (error) {
    res.status(500).send("Error retrieving farmers: " + error);
  }
};

// Get a single Farmer by ID
export const getFarmerById = async (req: Request, res: Response) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).send();
    }
    res.send(farmer);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a Farmer by ID
export const updateFarmer = async (req: Request, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["fullName", "landSize"]; // Fields that can be updated
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).send();
    }

    updates.forEach((update) => ((farmer as any)[update] = req.body[update]));
    await farmer.save();
    res.send(farmer);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a Farmer by ID
export const deleteFarmer = async (req: Request, res: Response) => {
  try {
    const farmer = await Farmer.findByIdAndDelete(req.params.id);
    if (!farmer) {
      return res.status(404).send();
    }
    res.send(farmer);
  } catch (error) {
    res.status(500).send(error);
  }
};
