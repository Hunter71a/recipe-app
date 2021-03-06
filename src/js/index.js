// Global app controller

// to avoid the browser limitations of using fetch, we will use
// a popular https request library called 'axios'
// install using '>npm install axios --save'
// import using name found in package.json


import Likes from './models/Likes';
import List from './models/List';
import Recipe from './models/Recipe';
import Search from './models/Search';
import * as likesView from './views/likesView';
import * as listView from './views/listView';
import * as recipeView from './views/recipeView';
import * as searchView from './views/searchView';
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
      clearLoader();
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)        
        );

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


/**
 * LIST CONTROLLER
 */
const controlList = () => {
  // Create a new list if there is none yet
  if (!state.list) state.list = new List();

  // Add each ingredient to the list
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
}

// handle delete and update list item events
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;
  const count = state.list.items.find(item => item.id === id).count;
  // Handle the delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from state and user interface
    state.list.deleteItem(id);
    listView.deleteItem(id);
    // handle count update
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    if (count > 0) {
      state.list.updateCount(id, val);
    } else {
      e.target.value = 0;
    }
  }
});




/**
 * LIKE CONTROLLER
 */

//state.likes = new Likes();
//  likesView.toggleLikeBtn(state.likes.getNumLikes());

const controlLike = () => {
  // create likes object and add to state
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // Case 1: User has not liked current recipe yet
  if (!state.likes.isLiked(currentID)) {
    // Add like to state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    // Toggle the like button
    likesView.toggleLikeBtn(true);

    // Add like to UI list
    likesView.renderLike(newLike);

    // Case 2: User has already liked current recipe
  } else {
    // remove like from state
    state.likes.deleteLike(currentID);


    // toggle the like button
    likesView.toggleLikeBtn(false);

    // Remove like from the UI lise
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};


// Restore liked recipes on page load
window.addEventListener('load', () => {
  state.likes = new Likes();
  
  // Restore likes
  state.likes.readStorage();

  // toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // Render the existing likes
  state.likes.likes.forEach(like => likesView.renderLike(like));
});



// handling recipe button clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // decrease ingredients button event
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // increase ingredients butten event
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // Add ingredients
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // Like controller
    controlLike();
  }
});



