import express from "express";
import * as bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { Response, Request ,NextFunction} from "express";
import connectDB from "./config/db"; // Path to your MongoDB connection logic

import authRoutes from "./routes/authRoutes";
import farmerRoutes from "./routes/farmerRoutes";
import orderRoutes from "./routes/orderRoutes";
import productRoutes from "./routes/productRoutes";

dotenv.config(); // This loads the environment variables from the .env file

connectDB(); // Connect to MongoDB

const app = express();
const PORT = process.env.PORT || 3000;

// Security enhancements
app.use(helmet()); // Helps secure your apps by setting various HTTP headers
app.use(cors()); // Enable CORS with various options
app.use(bodyParser.json()); // Middleware to parse JSON bodies

app.use(express.json()); // Middleware to parse JSON bodies

// Setup routes with proper base paths
app.use("/api/auth", authRoutes);
app.use("/api/", farmerRoutes);
app.use("/api/", orderRoutes);
app.use("/api/", productRoutes);
// not found middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send("Not found");
});

// Error handling middleware
app.use((err:any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
