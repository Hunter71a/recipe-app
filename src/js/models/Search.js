/////////////////////////
// NOTES FOR CUSTOM API:
//const getResult = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);

// returns an ID to be used for getting the result
//const searchResult = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);

/////////////////////////////

import axios from 'axios';


export default class Search {
  constructor(query) {
    this.query = query;
  }
  async getResults(query) {
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    try {
      const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
      this.result = res.data.recipes;
    // console.log(this.result);
    } catch (error) {
      alert(error);
    }
  }
}