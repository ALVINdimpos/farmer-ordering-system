import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../config/mailer";
import { JwtPayload } from "jsonwebtoken";
import { validationResult } from "express-validator";
import logger from "../../logs/logger";


const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const register = async (req: Request, res: Response) => {
    
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error("Register User : Error in register validation", {
      errors: errors.array(),
    });
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { username, email, password, role } = req.body;
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      logger.error("Register User : User already exists with email " + email);
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt

    // Create new user with hashed password
    user = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await user.save(); // Save the new user
    logger.info("Register User : New user registered successfully");
     
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    logger.error("Register User : Error in registering user", { error });
    res.status(500).send("Error registering the user");
  }
};

export const login = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }
    try {
      const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });
        logger.info("Login User : User logged in successfully");
        res.send({ 
            message: "User logged in successfully",
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
    });
    } catch (error) {
    logger.error("Login User : Error in login", { error });
    res.status(500).send(error);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }    
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send("User not found");
  }

  const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour
  const resetLink = `http://yourfrontend.com/reset-password/${token}`;

  await sendEmail(
    user.email,
    "Password Reset Request",
    `Please click on the following link to reset your password: ${resetLink}`
  );

  res.send("Password reset email sent");
};

export const resetPassword = async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }
  try {
    const { token, newPassword } = req.body;
    const decoded: JwtPayload = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.password = newPassword;
    await user.save();

    res.send("Password has been reset successfully");
  } catch (error) {
    res.status(500).send("Error resetting password");
  }
};
