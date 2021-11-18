const { render } = require('ejs');
const express = require('express');
const router = express.Router();
//
const { default: axios } = require("axios");

//
router.get('/', async function(req,res){
    const queryGames = {
      method: 'POST',
      url: 'https://api.igdb.com/v4/games',
      headers: {
        'Client-ID': 'xxx',
        Authorization: 'Bearer xxx'
      },
      data: 'f name,first_release_date,release_dates.date,release_dates.human,rating, rating_count;\n\nwhere rating >= 90 & first_release_date >=1514768461 & rating_count > 100 & first_release_date <= 1609462861;\nsort first_release_date desc;\nlimit 15;\n\n'
    };
    var resultsAPI
    resultsAPI = (await axios.request(queryGames)).data
  
    //en donde se haria el query y donde va lo de header?
    res.render('home', {resultsAPI});
  });

  module.exports = router;