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
    console.log(`Api gameNo: ${resultsAPI[0].id}` )

    // con el for el array dice undefined
    
    
    //var resultsImages =[];
    var resultsImages
    var urlArray=[];
    var rawCoverURL
    var processedCoverURL
   for(var i=0; i< resultsAPI.length; i++) {
    const queryImages = {
      method: 'POST',
      url: 'https://api.igdb.com/v4/covers',
      headers: {
        'Client-ID': 'xxx',
        Authorization: 'Bearer xxx'
      },
      data: `f *; where game = ${resultsAPI[i].id};` 
      
    };
    //resultsImages.push((await axios.request(queryImages)).data) 
    //
    resultsImages = (await axios.request(queryImages)).data
    rawCoverURL = resultsImages[0].url
    processedCoverURL = rawCoverURL.replace("t_thumb","t_cover_big");
   // urlArray.push(resultsImages[0].url)
   urlArray.push(processedCoverURL)
    //
    console.log(urlArray[i])

  }
  
 

 // version para solo una imagen en indice 0 
 //idea: hacer una funcion que regrese ya el url, llamarla 15 veces
 //parametros: el gameID, que es del resAPI
 /*
  const queryImages = {
    method: 'POST',
    url: 'https://api.igdb.com/v4/covers',
    headers: {
      'Client-ID': 'xxx',
      Authorization: 'Bearer xxx'
    },
    data: `f *; where game = ${resultsAPI[0].id};` 
    
  };
  resultsImages = (await axios.request(queryImages)).data
  */
  // --------
    
  //  res.render('home', {resultsAPI, resultsImages});
    res.render('home', {resultsAPI, urlArray});
    console.log(`Image url: ${resultsImages[0].url}`)
    //console.log(resultsImages[0])
    console.log(urlArray)
  });

//
/*
function getImageURL(gameID) {
  const urlQuery = {
    method: 'POST',
    url: 'https://api.igdb.com/v4/covers',
    headers: {
      'Client-ID': 'xxx',
      Authorization: 'Bearer xxx'
    },
    data: `f *; where game = ${gameID};` 
    
  };
  resultsImages = (await axios.request(urlQuery)).data
  imageURL = resultsImages[0].url
  return imageURL

}
*/

//------------------

//dynamic routes
router.get("/:requestID", async  (req,res) => {
    if(req.params.requestID == "login"){
        res.render('login');

    }else if(req.params.requestID == "signup"){
      res.render('signup');

    }else if(req.params.requestID == "userpage"){
      res.render('userpage');

    }else if(req.params.requestID == "gameinfo"){
      res.render('gameinfo');

    }
    
})

  //


  module.exports = router;