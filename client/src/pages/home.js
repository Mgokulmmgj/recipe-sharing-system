import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import "./Home.css";
import { FaSave, FaCheckCircle } from "react-icons/fa";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userID = useGetUserID();

  // Fetch all recipes and saved recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          "https://mern-recipe-app1-server.onrender.com/recipes"
        );
        setRecipes(response.data);
      } catch (err) {
        console.error("Error fetching recipes:", err);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        if (userID) {
          const response = await axios.get(
            `https://mern-recipe-app1-server.onrender.com/recipes/savedRecipes/ids/${userID}`
          );
          setSavedRecipes(response.data.savedRecipes || []);
        }
      } catch (err) {
        console.error("Error fetching saved recipes:", err);
      }
    };

    fetchRecipes();
    fetchSavedRecipes();
  }, [userID]);

  // Save a recipe
  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put(
        "https://mern-recipe-app1-server.onrender.com/recipes",
        {
          recipeID,
          userID,
        }
      );
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.error("Error saving recipe:", err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  return (
    <div className="home-page">
      <h1>Recipes</h1>

      <ul className="recipe-list">
        {recipes.map((recipe) => (
          <li key={recipe._id} className="recipe-card">
            <h2>{recipe.name}</h2>

            {recipe.imageUrl && (
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="recipe-image"
              />
            )}

            <div className="instructions">
              <p>{recipe.instructions}</p>
              <p>Cooking Time: {recipe.cookingTime} minutes</p>
            </div>

            <h4 style={{ paddingLeft: "20px" }}>Ingredients:</h4>
            <ul className="ingredients-list">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>

            {userID ? (
              isRecipeSaved(recipe._id) ? (
                <button className="save-button" disabled>
                  <FaCheckCircle style={{ marginRight: "8px" }} />
                  Saved
                </button>
              ) : (
                <button
                  className="save-button"
                  onClick={() => saveRecipe(recipe._id)}
                >
                  <FaSave style={{ marginRight: "8px" }} />
                  Save
                </button>
              )
            ) : (
              <span className="login-prompt">Log in to Save</span>
            )}
          </li>
        ))}
      </ul>

      {/* Saved Recipes Section */}
      {userID && savedRecipes.length > 0 && (
        <>
          <h1 className="saved-recipes-title">My Saved Recipes</h1>
          <ul className="saved-recipe-list">
            {recipes
              .filter((recipe) => isRecipeSaved(recipe._id))
              .map((savedRecipe) => (
                <li key={savedRecipe._id} className="recipe-card saved-card">
                  <h3>{savedRecipe.name}</h3>
                  {savedRecipe.imageUrl && (
                    <img
                      src={savedRecipe.imageUrl}
                      alt={savedRecipe.name}
                      className="recipe-image"
                    />
                  )}
                  <div className="instructions">
                    <p>{savedRecipe.instructions}</p>
                    <p>Cooking Time: {savedRecipe.cookingTime} minutes</p>
                  </div>
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
};
