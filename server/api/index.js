import express from "express";
import serverless from "serverless-http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import recipesRouter from "../routes/recipes.js";
import userRouter from "../routes/user.js";

dotenv.config();

const app = express(); // Declare only once

// Middleware
app.use(express.json());

// Routes
app.use("/api/recipes", recipesRouter);
app.use("/api/users", userRouter);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

// Export for Vercel serverless
export default serverless(app);
