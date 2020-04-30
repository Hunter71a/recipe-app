import axios from 'axios';
import { proxy } from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;

  }

  // Get Path: https://forkify-api.herokuapp.com/api/get
  // Example URL: https://forkify-api.herokuapp.com/api/get?rId=47746
  // Parameter rId, Required: yes 
  async getRecipe() {
    try {
      // const recipeDetails = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.id}`);
      // this.result = res.data.recipes;

      // const getResult = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);

      const recipeDetails = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
      this.title = recipeDetails.data.recipe.title;
      this.author = recipeDetails.data.recipe.publisher;
      this.img = recipeDetails.data.recipe.image_url;
      this.url = recipeDetails.data.recipe.source_url;
      this.ingredients = recipeDetails.data.recipe.ingredients;


      // const recipe = await axios(`${proxy}get?rId=${this.id}`);
      // console.log(res, recipeDetails);
      // console.log(recipe);


    } catch (error) {
      console.log(error);
      alert('Something done broke!');
    }
  }

  // need preparation time -- create fudge factor based on number of ingredients
  // assume need 15 minutes per every 3 ingredients 
  calcPrepTime() {
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }
  calcServings() {
    this.servings = 4;
  }
}
