/////////////////////////
// NOTES FOR CUSTOM API:
//const getResult = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);

// returns an ID to be used for getting the result
//const searchResult = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);

/////////////////////////////


// Forkify API notes:
// Search Path: https://forkify-api.herokuapp.com/api/search
// Example URL: https://forkify-api.herokuapp.com/api/search?q=pizza
// Parmeter: p, Required: yes 

// Get Path: https://forkify-api.herokuapp.com/api/get
// Example URL: https://forkify-api.herokuapp.com/api/get?rId=47746
// Parameter rId, Required: yes 

export const proxy = 'https://forkify-api.herokuapp.com/api/';

