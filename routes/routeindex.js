const { render } = require('ejs');
const express = require('express');
const router = express.Router();
var User = require("../Models/users")
var Reviews = require("../Models/reviews")
const { default: axios } = require("axios");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const verify = require("../middleware/verifyAccess")
//
const SECRET = process.env.SECRET || "perryThePlatypus"
//
router.get('/logout', async function(req,res) {
  console.log("Logging user out")
  res.clearCookie("token")
  res.redirect("/")
  });

router.get('/',verify, async function(req,res){
//TURN THE VALUES INTO XXX BEFORE UPLOADING
var clientIDkey = "8xmlvh16op42w7i239g2aimpfxj0av"
var bearerKey = "Bearer i4kb6g0xsmkvicxrwnhg71xvxkuv4m"
//!!!!!!!!!

    const queryGames = {
      method: 'POST',
      url: 'https://api.igdb.com/v4/games',
      headers: {
        'Client-ID': clientIDkey,
        Authorization: bearerKey
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
        'Client-ID': clientIDkey,
        Authorization: bearerKey
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
    

  }

    console.log(`User id is: ${req.userId}`)
    var userName = req.userId
    res.render('home', {resultsAPI, urlArray,userName});
  
    /*
     var user = new User ()
     var review = new Reviews ()
     review.reviewContent = "prueba de review con date"
     review.date = Date()
     user.reviewList.push(review)
     console.log(user)
     */
  });

  router.get("/login", async  (req,res) => {
    res.render('login');
  })
  router.get("/signup", async  (req,res) => {
    res.render('signup');
  })
  router.get("/userpage",verify, async  (req,res) => {
    var reviews  = await Reviews.find({user_id: req.userId})
    console.log(reviews) 


    res.render('userpage',{reviews});
   // res.render('userpage');
  })
  router.get("/gameinfo",verify, async  (req,res) => {
    res.render('gameinfo');
  })
//dynamic routes were causing many bugs

  //
  router.post('/signup', async function(req,res){
  
    //Implementar logica
    console.log(req.body)
    var user = new User(req.body)
    const usercheck = await User.findOne({email: user.email})
    if (!usercheck){
      user.password = await bcrypt.hashSync(user.password, 10)
      await user.save()
      res.redirect('/login')
    }
    else{
      return res.status(400).send("The user exist")
    }
    
    });

  //
  router.post('/login', async function(req,res){
    
    try{
    console.log(req.body)
    var {email,password} = req.body
    
    // Validar si el usuario existe
    const user = await User.findOne({email: email})

    if (!user){
      return res.status(404).send("The user does not exist")
     
    }
    // Si el usuario existe, vamos a generar un token de JWT
    else {
     const valid = await bcrypt.compare(password,user.password) 
   
   // Si la contraseña es correcta generamos un JWT
     if (valid) {
   
       const token = jwt.sign({id:user.email, permission: true}, SECRET, {expiresIn: "2m"})
       console.log(token)
       res.cookie("token", token, {httpOnly:true})
       console.log(`User ${user.email} has logged in`)
       res.redirect("/")
   
     }
   
     else {
       console.log("Password is invalid")
       res.redirect('/login')
     }
   
    }
  } catch(error){
    console.log(error)
  }
  });
  //
  

  module.exports = router;