import Order from "../models/Order";
import Product from "../models/Product";
import Farmer from "../models/Farmer";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import logger from "../../logs/logger";

// Helper function to calculate quantities of seeds and fertilizer
const calculateQuantities = async (landSize:number, seedsType:string, fertilizerType:string) => {
    const seeds = await Product.findOne({ productName: seedsType });
    const fertilizer = await Product.findOne({ productName: fertilizerType });

    // Calculating the seed amount: No more than 1 kg per acre
    const seedsAmount = seeds ? Math.min(landSize, seeds.suitableLandSize) : 0;
    const finalSeedsAmount = seedsAmount * 1; // Ensures no more than 1kg per acre

    // Calculating the fertilizer amount: No more than 3 kg per acre
    const fertilizerAmount = fertilizer ? Math.min(3 * landSize, fertilizer.suitableLandSize) : 0;
    const finalFertilizerAmount = Math.min(fertilizerAmount, 3 * landSize); // Ensures no more than 3kg per acre
console.log(
  `Seeds details: ${seeds}, Calculated seeds amount: ${finalSeedsAmount}`
);
console.log(
  `Fertilizer details: ${fertilizer}, Calculated fertilizer amount: ${finalFertilizerAmount}`
);

    return { seedsAmount: finalSeedsAmount, fertilizerAmount: finalFertilizerAmount };
};



// Create a new Order
export const createOrder = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error("Create Order : Error in create order validation", {
      errors: errors.array(),
    });
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { userId, seedsType, fertilizerType } = req.body;
    const farmer = await Farmer.findById(userId);
    if (!farmer) {
      logger.error("Create Order : Farmer not found with ID " + userId);
      return res.status(404).send("Farmer not found");
    }

    const { seedsAmount, fertilizerAmount } = await calculateQuantities(
      farmer.landSize,
      seedsType,
      fertilizerType
    );

    const order = new Order({
      userId,
      seedsType,
      seedsAmount,
      fertilizerType,
      fertilizerAmount,
      status: "Pending",
    });

    await order.save();
    logger.info("Create Order : New order created successfully");
    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    logger.error("Create Order : Error in creating order", { error });
    res.status(400).send(error);
  }
};

// get all orders
export const getAllOrders = async (req: Request, res: Response) => {
  const { page = 1, limit = 5 } = req.query; // Default page is 1, and limit is 5

  try {
    const orders = await Order.find()
      .sort({ seedsType: 1 }) // Sort alphabetically by seedsType
      .limit(Number(limit) * 1) // Convert limit to a number
      .skip((Number(page) - 1) * Number(limit)); // Convert page and limit to numbers
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get an Order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send();
    }
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update an Order
export const updateOrder = async (req: Request, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "seedsType",
    "seedsAmount",
    "fertilizerType",
    "fertilizerAmount",
    "status",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!order) {
      return res.status(404).send();
    }
    res.send(order);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete an Order
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).send();
    }
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send("Order not found");
    }

    order.status = req.body.status; // Expected 'Approved' or 'Rejected'
    await order.save();
    res.send(order);
  } catch (error) {
    res.status(400).send(error);
  }
};
