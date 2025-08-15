import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";

export const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      if (!userID) return; // Wait until userID is available
      try {
        const response = await axios.get(
          `https://mern-recipe-app1-server.onrender.com/recipes/savedRecipes/${userID}`
        );
        setSavedRecipes(response.data?.savedRecipes || []);
      } catch (err) {
        console.error("Failed to fetch saved recipes:", err);
      }
    };

    fetchSavedRecipes();
  }, [userID]); // re-run when userID becomes available

  return (
    <div className="saved-recipes-page">
      <h1>Saved Recipes</h1>

      {savedRecipes.length === 0 ? (
        <p>No saved recipes found.</p>
      ) : (
        <ul className="saved-recipe-list">
          {savedRecipes.map((recipe) => (
            <li key={recipe._id} className="recipe-card">
              <h2>{recipe.name}</h2>
              <p>{recipe.description}</p>
              {recipe.imageUrl && (
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="recipe-image"
                />
              )}
              <p>Cooking Time: {recipe.cookingTime} minutes</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
