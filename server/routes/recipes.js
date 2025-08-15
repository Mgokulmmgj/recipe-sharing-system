import express from "express";
import { RecipeModel } from "../models/Recipe.js";
import { UserModel } from "../models/User.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/**
 * POST /recipes/
 * Create a new recipe (Protected)
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const recipe = new RecipeModel(req.body);
    await recipe.save();
    res.status(201).json({ message: "✅ Recipe created successfully!" });
  } catch (err) {
    console.error("Error creating recipe:", err);
    res.status(500).json({ error: "Failed to create recipe" });
  }
});

/**
 * GET /recipes/
 * Get all recipes (Public)
 */
router.get("/", async (req, res) => {
  try {
    const recipes = await RecipeModel.find({});
    res.status(200).json(recipes);
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

/**
 * PUT /recipes/
 * Save a recipe to the user's saved list (Protected)
 */
router.put("/", verifyToken, async (req, res) => {
  const { recipeID } = req.body;
  const userID = req.userId; // comes from verifyToken

  try {
    const user = await UserModel.findById(userID);
    if (!user.savedRecipes.includes(recipeID)) {
      user.savedRecipes.push(recipeID);
      await user.save();
    }
    res.status(200).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    console.error("Error saving recipe:", err);
    res.status(500).json({ error: "Failed to save recipe" });
  }
});

/**
 * GET /recipes/savedRecipes/ids/:userID
 * Get only the saved recipe IDs for a user (Public)
 */
router.get("/savedRecipes/ids/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    res.status(200).json({ savedRecipes: user?.savedRecipes || [] });
  } catch (err) {
    console.error("Error fetching saved recipe IDs:", err);
    res.status(500).json({ error: "Failed to fetch saved recipe IDs" });
  }
});

/**
 * GET /recipes/savedRecipes/:userID
 * Get full recipe data for saved recipes (Public)
 */
router.get("/savedRecipes/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    const savedRecipes = await RecipeModel.find({
      _id: { $in: user?.savedRecipes || [] },
    });
    res.status(200).json({ savedRecipes });
  } catch (err) {
    console.error("Error fetching saved recipes:", err);
    res.status(500).json({ error: "Failed to fetch saved recipes" });
  }
});

// At the bottom of routes/recipes.js
export default router;

