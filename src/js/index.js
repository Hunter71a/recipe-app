// Global app controller

// to avoid the browser limitations of using fetch, we will use
// a popular https request library called 'axios'
// install using '>npm install axios --save'
// import using name found in package.json

// Forkify API notes:
// Search Path: https://forkify-api.herokuapp.com/api/search
// Example URL: https://forkify-api.herokuapp.com/api/search?q=pizza
// Parmeter: p, Required: yes 

// Get Path: https://forkify-api.herokuapp.com/api/get
// Example URL: https://forkify-api.herokuapp.com/api/get?rId=47746
// Parameter rId, Required: yes 

import Search from './models/Search';
import * as searchView from './views/searchView';
import {elements} from './views/base';

console.log('webpack-dev-server is running')
/**
Global state of the app
- Search object
- Current Recipe object
- Shopping list object
- liked Recipes
*/

 const state = {};

 const controlSearch= async () => {
  // get query from the view
  const query = 'pizza' // todo

  if (query) {
    // New Search Object and add to state
    state.search = new Search(query);

    // Prepare UI for results -- add spinner and clear input

    // Search for recipes
    await state.search.getResults();

    // Render results on UI
    console.log(state.search.result);


  }

   
 }

 document.querySelector('.search').addEventListener('submit', e => {
   e.preventDefault();
   controlSearch();
 });





