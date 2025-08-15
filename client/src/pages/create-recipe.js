import React, { useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./Create-recipe.css";
export const CreateRecipe = () => {
  const userID = useGetUserID();
  // This line is correct; `_` (the setCookie function) is intentionally not destructured as it's not used here.
  const [cookies] = useCookies(["access_token"]);
  
  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients: [],
    instructions: "",
    imageUrl: "",
    cookingTime: 0,
    userOwner: userID, // This ensures the created recipe is linked to the user
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (event, index) => {
    const { value } = event.target;
    const ingredients = [...recipe.ingredients];
    ingredients[index] = value;
    setRecipe({ ...recipe, ingredients });
  };

  const handleAddIngredient = () => {
    const ingredients = [...recipe.ingredients, ""];
    setRecipe({ ...recipe, ingredients });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send the new recipe data to your backend's POST /recipes endpoint
      await axios.post(
        "https://mern-recipe-app1-server.onrender.com/recipes",
        { ...recipe },
        {
          // Include the access token in the authorization header for authentication
          headers: { authorization: cookies.access_token },
        }
      );

      alert("Recipe Created");
      navigate("/"); // Navigate to the home page after successful creation
    } catch (error) {
      console.error(error); // Log any errors
      alert("Error creating recipe. Please try again."); // User-friendly error message
    }
  };

  return (
    <div className="create-recipe">
      <h2>Create Recipe</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={recipe.name}
          onChange={handleChange}
          required // Make name a required field
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={recipe.description}
          onChange={handleChange}
          required // Make description a required field
        ></textarea>

        <label htmlFor="ingredients">Ingredients</label>
        {recipe.ingredients.map((ingredient, index) => (
          <input
            key={index} // Use index as key, consider a more stable ID if reordering is possible
            type="text"
            name="ingredients"
            value={ingredient}
            onChange={(event) => handleIngredientChange(event, index)}
            placeholder={`Ingredient ${index + 1}`} // Placeholder for better UX
          />
        ))}
        <button type="button" onClick={handleAddIngredient}>
          Add Ingredient
        </button>

        <label htmlFor="instructions">Instructions</label>
        <textarea
          id="instructions"
          name="instructions"
          value={recipe.instructions}
          onChange={handleChange}
          required // Make instructions a required field
        ></textarea>

        <label htmlFor="imageUrl">Image URL</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={recipe.imageUrl}
          onChange={handleChange}
          // imageUrl is often optional, but you can make it required if needed
        />

        <label htmlFor="cookingTime">Cooking Time (minutes)</label>
        <input
          type="number"
          id="cookingTime"
          name="cookingTime"
          value={recipe.cookingTime}
          onChange={handleChange}
          required // Make cooking time a required field
          min="1" // Ensure cooking time is at least 1 minute
        />

        <button type="submit">Create Recipe</button>
      </form>
    </div>
  );
};