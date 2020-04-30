import axios from 'axios';
import {proxy} from '../config';

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
      this.result = res.data.recipes;
      console.log(recipeDetails);

      // const recipe = await axios(`${proxy}get?rId=${this.id}`);
      // console.log(res, recipeDetails);
      // console.log(recipe);


    } catch(error) {
      console.log(error);
    }
 //   return recipeDetails;
  }
}