import Product from "../models/Product";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import logger from "../../logs/logger";
// Create a new Product
export const createProduct = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error("Create Product : Error in create product validation", {
      errors: errors.array(),
    });
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const product = new Product(req.body);
    await product.save();
    logger.info("Create Product : New product created successfully");
    res.status(201).json({ 
      message: "Product created successfully", 
      product: product
    });
  } catch (error) {
    logger.error("Create Product : Error in creating product", { error });
    res.status(400).send(error);
  }
};

// Get all Products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a single Product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a Product
export const updateProduct = async (req: Request, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["productName", "productType", "suitableLandSize"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a Product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (error) {
    res.status(500).send(error);
  }
};
