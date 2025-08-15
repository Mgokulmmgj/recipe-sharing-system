import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
  name: String,
  description: String,
  ingredients: [String],
  instructions: String,
  imageUrl: String,
  cookingTime: Number,
  userOwner: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

export const RecipeModel = mongoose.model("recipes", RecipeSchema);
