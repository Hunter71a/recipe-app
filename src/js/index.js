// Global app controller

// to avoid the browser limitations of using fetch, we will use
// a popular https request library called 'axios'
// install using '>npm install axios --save'
// import using name found in package.json


import Recipe from './models/Recipe';
import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader, elementStrings } from './views/base';


console.log('webpack-dev-server is running')
/**
Global state of the app
- Search object
- Current Recipe object
- Shopping list object
- liked Recipes
*/
const state = {};

/**
 * SEARCH CONTROLLER
*/
const controlSearch = async () => {
  // get query from the view
  const query = searchView.getInput();
  //const query = 'pizza';

  if (query) {
    // New Search Object and add to state
    state.search = new Search(query);

    // Prepare UI for results -- add spinner and clear input
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchResultArea);


    try {
      // Search for recipes
      await state.search.getResults();

      // Render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      console.log(error);
      clearLoader();
    }
  }
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

// testing -- automatically on document load
// window.addEventListener('load', e => {
//   e.preventDefault();
//   elements.searchInput.value = 'pizza';
//   controlSearch();
// });

elements.searchResultPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/**
 * Recipe controller
 */

const controlRecipe = async () => {
  // Get ID from url
  const id = window.location.hash.replace('#', '');
  console.log(id);


  if (id) {
    // prepare the UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // highlight selected 
    if (state.search) searchView.highlightSelected(id);

    // Create new recipe object
    state.recipe = new Recipe(id);

    // testing -- adds object to console to easier inspect
    window.r = state.recipe;

    try {
      // get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();


      // Calculate servings and time
      state.recipe.calcPrepTime();
      state.recipe.calcServings();


      // render recipe
     // console.log(state.recipe);
      clearLoader();
      recipeView.renderRecipe(state.recipe);

    } catch (error) {
      console.log(error);
      alert('Something has gone wrong: ');
    }
  }
};

// step 1: add an event listener to the global object
// window.addEventListener('hashchange', controlRecipe);
// add event listener to the "load window" event
// window.addEventListener('load', controlRecipe);

// combine these into a single statement
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


//  controlSearch({query: 'pizza'});

// const r = new Recipe(46895);
// r.getRecipe();
// console.log(r);
