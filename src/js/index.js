// Global app controller

// to avoid the browser limitations of using fetch, we will use
// a popular https request library called 'axios'
// install using '>npm install axios --save'
// import using name found in package.json


import Recipe from './models/Recipe';
import Search from './models/Search';
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
  console.log(query);

  if (query) {
    // New Search Object and add to state
    state.search = new Search(query);

    // Prepare UI for results -- add spinner and clear input
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchResultArea);


    // Search for recipes
    await state.search.getResults();

    // Render results on UI
    clearLoader();
    searchView.renderResults(state.search.result);

  }
}

document.querySelector('.search').addEventListener('submit', e => {
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

const r = new Recipe(47746);
r.getRecipe();



