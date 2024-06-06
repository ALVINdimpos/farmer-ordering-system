import { body, param, query } from "express-validator";

export const registerValidation = [
  body("email").isEmail().withMessage("Provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("username").not().isEmpty().withMessage("Username is required"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Provide a valid email"),
  body("password").not().isEmpty().withMessage("Password is required"),
];

export const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Provide a valid email"),
];

export const resetPasswordValidation = [
  body("token").not().isEmpty().withMessage("Token is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
export const createFarmerValidation = [
  body("userId").not().isEmpty().withMessage("User ID is required"),
  body("landSize").not().isEmpty().withMessage("Land size is required"),
  body("cropTypes")
    .isArray({ min: 1 })
    .withMessage("At least one crop type is required"),
  body("landSize")
    .isFloat({ gt: 0 })
    .withMessage("Land size must be a positive number"),
  body("cropTypes")
    .isArray({ min: 1 })
    .withMessage("At least one crop type is required"),
];

export const updateFarmerValidation = [
  body("fullName")
    .optional()
    .not()
    .isEmpty()
    .withMessage("Full name must not be empty"),
  body("landSize")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Land size must be a positive number"),
];

export const farmerIdValidation = [
  param("id").isMongoId().withMessage("Invalid farmer ID format"),
];

export const createOrderValidation = [
  body("userId").isMongoId().withMessage("Invalid user ID format"),
  body("seedsType").not().isEmpty().withMessage("Seeds type is required"),
  body("fertilizerType")
    .not()
    .isEmpty()
    .withMessage("Fertilizer type is required"),
];

export const updateOrderValidation = [
  body("seedsType").optional().not().isEmpty(),
  body("seedsAmount")
    .optional()
    .isNumeric()
    .withMessage("Seeds amount must be a number"),
  body("fertilizerType").optional().not().isEmpty(),
  body("fertilizerAmount")
    .optional()
    .isNumeric()
    .withMessage("Fertilizer amount must be a number"),
  body("status")
    .optional()
    .isIn(["Pending", "Approved", "Rejected"])
    .withMessage("Invalid status"),
];

export const orderIdValidation = [
  param("id").isMongoId().withMessage("Invalid order ID format"),
];

export const paginationValidation = [
  query("page").optional().isNumeric().withMessage("Page must be a number"),
  query("limit").optional().isNumeric().withMessage("Limit must be a number"),
];

export const createProductValidation = [
  body("productName").not().isEmpty().withMessage("Product name is required"),
  body("productType")
    .isIn(["Seed", "Fertilizer"])
    .withMessage('Product type must be either "Seed" or "Fertilizer"'),
  body("suitableLandSize")
    .isFloat({ gt: 0 })
    .withMessage("Suitable land size must be a positive number"),
];

export const updateProductValidation = [
  body("productName").optional().not().isEmpty(),
  body("productType").optional().isIn(["Seed", "Fertilizer"]),
  body("suitableLandSize").optional().isFloat({ gt: 0 }),
];

export const productIdValidation = [
  param("id").isMongoId().withMessage("Invalid product ID format"),
];