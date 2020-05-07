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

  // create a new array of ingredients that has standardized language
  parseIngredients() {
    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
    const units = [...unitsShort, 'kg', 'g'];


    const newIngredients = this.ingredients.map(item => {
        // 1) Uniform units
        let ingredient = item.toLowerCase();
        unitsLong.forEach((unit, i) => {
          ingredient = ingredient.replace(unit, unitsShort[i]);
        });

        // 2) Remove parenthesis
        ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

        // 3) Parse ingredients into count, unit, and ingredients
        const arrIng = ingredient.split(' ');
        const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

        let objIng;
        // check if found a unit index
        if (unitIndex > -1) {
          const arrCount = arrIng.slice(0, unitIndex);  // ex. 4 1/2 cups
          let count;
          if (arrCount.length === 1) {
            count = eval(arrIng[0].replace('-', '+'));
          } else {
            count = eval(arrIng.slice(0, unitIndex).join('+'));
          }
          objIng = {
            count,
            unit: arrIng[unitIndex],
            ingredient: arrIng.slice(unitIndex + 1).join(' ')
          }

        } else if (parseInt(arrIng[0], 10)) {
          // there is No unit element, and first element is a number
          objIng = {
            count: parseInt(arrIng[0], 10),
            unit: '',
            ingredient: arrIng.slice(1).join('  ')
          }
        } else if (unitIndex === -1) {
          // there is NO unit and no number in the 1st position 
          objIng = {
            count: 1,
            unit: '',
            ingredient
          }
        }      

        return objIng;


    });
    this.ingredients = newIngredients;
  }

  updateServings(type) {
    // Servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

    // Ingredients
    this.ingredients.forEach(ingredient => {
      ingredient.count *= (newServings / this.servings);
    });


    this.servings = newServings;
  } 


}
