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
//TURN THE VALUES INTO XXX BEFORE UPLOADING
var clientIDkey = "8xmlvh16op42w7i239g2aimpfxj0av"
var bearerKey = "Bearer i4kb6g0xsmkvicxrwnhg71xvxkuv4m"
//!!!!!!!!!--------------------------------------------------------


router.get('/',verify, async function(req,res){

    const queryGames = {
      method: 'POST',
      url: 'https://api.igdb.com/v4/games',
      headers: {
        'Client-ID': clientIDkey,
        Authorization: bearerKey
      },
      data: 'f name,first_release_date,release_dates.date,release_dates.human,rating, rating_count;\n\nwhere rating >= 90 & first_release_date >=1514768461 & rating_count > 100 & first_release_date <= 1609462861;\nsort first_release_date desc;\nlimit 10;\n\n'
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


    var user = await User.find({email: req.userId} , {email: 1, favoriteGames: 1,reviewList: 1, _id: 0})
    var favoritegames = user[0].favoriteGames
    var reviews = user[0].reviewList
    var gameData = []
    var resultsImages = []
    var url = []
    var rawCoverURL = []
    var processedCoverURL = []
    for (var i = 0; i < favoritegames.length; i++){
      var volatileData
      var queryData = {
        method: 'POST',
        url: 'https://api.igdb.com/v4/games',
        headers: {
          'Client-ID': clientIDkey,
          Authorization: bearerKey
        },
        data: `fields *; where id = ${favoritegames[i]};`     
      };
      
      volatileData = (await axios.request(queryData)).data
      gameData[i] = volatileData[0]
    
      const queryImages = {
        method: 'POST',
        url: 'https://api.igdb.com/v4/covers',
        headers: {
          'Client-ID': clientIDkey,
          Authorization: bearerKey
        },
        data: `f *; where game = ${favoritegames[i]} & url != null;` 
        
      };

      console.log(`found game: ${gameData[i].name}`)
      

      resultsImages = (await axios.request(queryImages)).data
     // console.log(`found game url: ${resultsImages[0].url}` )
      if (typeof(resultsImages[0].url) === 'undefined'){
        console.log("reassigning undefined url")
        resultsImages[0].url = "https://i.redd.it/ldbo7yn202m21.jpg"

        console.log(resultsImages[0].url)
      }
      console.log(resultsImages[0].url)
      rawCoverURL = resultsImages[0].url

      processedCoverURL = rawCoverURL.replace("t_thumb","t_cover_big");
     // urlArray.push(resultsImages[0].url)
     url[i]=processedCoverURL
    
    
    }



    res.render('userpage',{reviews,gameData, url, user});
  })
  router.get("/gameinfo/:id",verify, async  (req,res) => {
    
//!!!!!!!!!
    var id = parseInt(req.params.id)
    const queryData = {
      method: 'POST',
      url: 'https://api.igdb.com/v4/games',
      headers: {
        'Client-ID': clientIDkey,
        Authorization: bearerKey
      },
      data: `fields *; where id = ${id};`     
    };
    console.log(queryData)
    var gameData
    gameData = (await axios.request(queryData)).data
    console.log(`Game data: ${gameData[0]}`)
    console.log(`Game: ${gameData[0].id}` )
    console.log(`Game name: ${gameData[0].name}` )
    console.log(`Game rating: ${gameData[0].rating}` )
    console.log(`User id is: ${req.userId}`)
    
    //now we get images from the API
    var resultsImages
    var url
    var rawCoverURL
    var processedCoverURL
    
      const queryImages = {
        method: 'POST',
        url: 'https://api.igdb.com/v4/covers',
        headers: {
          'Client-ID': clientIDkey,
          Authorization: bearerKey
        },
        data: `f *; where game = ${gameData[0].id} & url != null;` 
        
      };
      //resultsImages.push((await axios.request(queryImages)).data) 
      //
      console.log(`found game: ${gameData[0].name}` )

      resultsImages = (await axios.request(queryImages)).data
     // console.log(`found game url: ${resultsImages[0].url}` )
      if (typeof(resultsImages[0].url) === 'undefined'){
        console.log("reassigning undefined url")
        resultsImages[0].url = "https://i.redd.it/ldbo7yn202m21.jpg"

        console.log(resultsImages[0].url)
      }
      rawCoverURL = resultsImages[0].url
      console.log(rawCoverURL)
      processedCoverURL = rawCoverURL.replace("t_thumb","t_cover_big");
     // urlArray.push(resultsImages[0].url)
     url=processedCoverURL
  
    var userName = req.userId
    res.render('gameinfo', {gameData, url, userName});
  })
  router.get("/findgames",verify, async  (req,res) => {
    var query
    //res.render('findgames', {query});
    var resultsAPI =0
    var urlArray=[]
    var userName = req.userId
    res.render('findgames', {query,resultsAPI,urlArray,userName});
  })

  router.get("/review/:id",verify, async  (req,res) => {
    
    //!!!!!!!!!
    console.log("entramos")
        var id = parseInt(req.params.id)
        const queryData = {
          method: 'POST',
          url: 'https://api.igdb.com/v4/games',
          headers: {
            'Client-ID': clientIDkey,
            Authorization: bearerKey
          },
          data: `fields *; where id = ${id};`     
        };
        console.log(queryData)
        var gameData
        gameData = (await axios.request(queryData)).data
        console.log(`Game data: ${gameData[0]}`)
        console.log(`Game: ${gameData[0].id}` )
        console.log(`Game name: ${gameData[0].name}` )
        console.log(`Game rating: ${gameData[0].rating}` )
        console.log(`User id is: ${req.userId}`)
        
        //now we get images from the API
        var resultsImages
        var url
        var rawCoverURL
        var processedCoverURL
        
          const queryImages = {
            method: 'POST',
            url: 'https://api.igdb.com/v4/covers',
            headers: {
              'Client-ID': clientIDkey,
              Authorization: bearerKey
            },
            data: `f *; where game = ${gameData[0].id} & url != null;` 
            
          };
          //resultsImages.push((await axios.request(queryImages)).data) 
          //
          console.log(`found game: ${gameData[0].name}` )
    
          resultsImages = (await axios.request(queryImages)).data
         // console.log(`found game url: ${resultsImages[0].url}` )
          if (typeof(resultsImages[0].url) === 'undefined'){
            console.log("reassigning undefined url")
            resultsImages[0].url = "https://i.redd.it/ldbo7yn202m21.jpg"
    
            console.log(resultsImages[0].url)
          }
          rawCoverURL = resultsImages[0].url
          console.log(rawCoverURL)
          processedCoverURL = rawCoverURL.replace("t_thumb","t_cover_big");
         // urlArray.push(resultsImages[0].url)
         url=processedCoverURL
      
        var userName = req.userId
          //
          var user = await User.findOne({email: userName})
          var exist = false;
          var i= 0
          for( i ; i < user.reviewList.length; i++){
             if (user.reviewList[i].gameID  == id){
              exist = true;
              break;
            }
          }
          //ya existe un review
          //

        res.render('review', {gameData, url, userName,exist});
      })


      router.get("/findgames",verify, async  (req,res) => {
        var query
        //res.render('findgames', {query});
        var resultsAPI =0
        var urlArray=[]
        var userName = req.userId
        res.render('findgames', {query,resultsAPI,urlArray,userName});
      })

  router.post("/searchGames",verify, async  (req,res) => {
    var query
    //hacer queries del API
    //ver como pasar la info del query al refresh de la paginia
    query = req.body.search
    //api stuff
    const searchQuery = {
      method: 'POST',
      url: 'https://api.igdb.com/v4/games',
      headers: {
        'Client-ID': clientIDkey,
        Authorization: bearerKey
      },
      data: `f *;\nwhere name ~ *"${query}"* & version_parent = null & cover != null;\nsort release_dates.date desc;\nlimit 10;`
    };
    var resultsAPI
    resultsAPI
    resultsAPI = (await axios.request(searchQuery)).data
    console.log(`Api game 1: ${resultsAPI[0].name}` )
    console.log(`Api game 1r rating: ${resultsAPI[0].rating}` )
    //now we get images from the API
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
        data: `f *; where game = ${resultsAPI[i].id} & url != null;` 
        
      };
      //resultsImages.push((await axios.request(queryImages)).data) 
      //
      console.log(`found game: ${resultsAPI[i].name}` )

      resultsImages = (await axios.request(queryImages)).data
     // console.log(`found game url: ${resultsImages[0].url}` )
      if (typeof(resultsImages[0].url) === 'undefined'){
        console.log("reassigning undefined url")
        resultsImages[0].url = "https://i.redd.it/ldbo7yn202m21.jpg"

        console.log(resultsImages[0].url)
      }
      rawCoverURL = resultsImages[0].url
      console.log(rawCoverURL)
      processedCoverURL = rawCoverURL.replace("t_thumb","t_cover_big");
     // urlArray.push(resultsImages[0].url)
     urlArray.push(processedCoverURL)
  
    }
    //
    var userName = req.userId

    console.log(`Query: ${query}`)
    res.render('findgames', {query,resultsAPI,urlArray,userName});
  })
  
  router.post('/saveFav/:id',verify, async (req, res, next) => {

    /*
    var id  = req.params.id
    var task = await Task.findById(id)
    task.status = !task.status
    await task.save()
    res.redirect('/')
    */
    //stuff from skeleton above
    //my stuff
    var id = parseInt(req.params.id)
    console.log(`Game id is: ${id}`)
    var userName = req.userId

    //NOTA: Por el momento y diseno, los users repetidos pueden causar comportamientos
    //extra~os, entonces se recomienda que para login se haga un failsafe al hacer nuevos
    //y el nombre ya existe: es decir, no dejar crear cuentas con emails en la DB

    var user = await User.findOne({email: userName})
    console.log(`${userName}'s favs: ${user.favoriteGames}`)
    //luego habilitar un findOne que revise si ya existe el ID para no meterlo
    user.favoriteGames.push(id)
    await user.save()
    console.log(`${userName}'s favs: ${user.favoriteGames}`)
    //res.redirect('findgames', {query,resultsAPI,urlArray,userName});
    res.redirect('/findgames')

    });

    router.post('/deleteFav/:id',verify, async (req, res, next) => {

      var id = parseInt(req.params.id)
      console.log(`Game id is: ${id}`)
      var userName = req.userId
  
      //NOTA: Por el momento y diseno, los users repetidos pueden causar comportamientos
      //extra~os, entonces se recomienda que para login se haga un failsafe al hacer nuevos
      //y el nombre ya existe: es decir, no dejar crear cuentas con emails en la DB
  
      var user = await User.findOne({email: userName})
      console.log(`${userName}'s favs: ${user.favoriteGames}`)
      //luego habilitar un findOne que revise si ya existe el ID para no meterlo
      var index = user.favoriteGames.indexOf(id);
      if (index !== -1) {
        user.favoriteGames.splice(index, 1);
      }
      console.log(user.favoriteGames)
      await user.save()
      console.log(`${userName}'s favs: ${user.favoriteGames}`)
      res.redirect('/userpage')
  
      });
      router.post('/deleteReview/:id',verify, async (req, res, next) => {

        console.log(`req gamID: ${req.params.id}`)
        var id = parseInt(req.params.id)
        console.log(`Game id is: ${id}`)
        var userName = req.userId
    
        var user = await User.findOne({email: userName})
       // console.log(`${userName}'s reviews: ${user.reviewList}`)
        var i=0
        var index = -1
        for(i ; i< user.reviewList.length ;i++) {
          if (user.reviewList[i].gameID == id)
          {
            index = i
            break
          }
        }

       // var index = user.reviewList.indexOf(id)
        console.log( `Index: ${index}`)
        if (index != -1) {
          console.log("deleting review!-----------------")
          user.reviewList.splice(index, 1);
        }
        await user.save()
      //  console.log(`${userName}'s reviews: ${user.reviewList}`)
        res.redirect('/userpage')
    
        });


 //make the way for users to add to game to corresponding array of gameID
  router.post('/review/:id',verify, async (req, res, next) => {
    var userName = req.userId
    var user = await User.findOne({email: userName})
    var id = parseInt(req.params.id)
    var review = req.body
    var reviews = user.reviewList
    var resultsImages
    var rawCoverURL
    var processedCoverURL

    
    console.log("/******************/")
    var exist = false;
    var i= 0
    for( i ; i < user.reviewList.length; i++){
      if (user.reviewList[i].gameID  == id){
        exist = true;
        break;
      }
    }
    console.log(exist)
    console.log("/******************/")

    

    
    const queryImages = {
      method: 'POST',
      url: 'https://api.igdb.com/v4/covers',
      headers: {
        'Client-ID': clientIDkey,
        Authorization: bearerKey
      },
      data: `f *; where game = ${id} & url != null;` 
      
    };
    //resultsImages.push((await axios.request(queryImages)).data) 
    //
    resultsImages = (await axios.request(queryImages)).data
    rawCoverURL = resultsImages[0].url
    processedCoverURL = rawCoverURL.replace("t_thumb","t_cover_big");
    const fecha = new Date();

    if(!exist){
    user.reviewList.push({reviewContent : `${review.reviewContent}`, score : `${review.score}`, imageURL: processedCoverURL, gameID: `${id}`, user: userName, date: fecha,reviewed:true, user_id:`${user._id}`})
    }else{
      user.reviewList[i] =  {reviewContent : `${review.reviewContent}`, score : `${review.score}`, imageURL: processedCoverURL, gameID: `${id}`, user: userName, date: fecha,reviewed: true, user_id:`${user._id}`}
    }
    //console.log({reviewContent : `${review.reviewContent}`, score : `${review.score}`, imageURL: processedCoverURL, gameID: `${id}`, user: userName, date: fecha, user_id:`${user._id}`})
    await user.save()
    res.redirect(`/userpage`)
  });

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
      /*SOLO INVENTE EL NUMERO DE ERROR, NI IDEA SI ESE SEA */
      return res.status(400).send("The user already exists exist")
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
   
      //en expires in pones la duracion de una sesiion 
      // m = minutos h = horas
       const token = jwt.sign({id:user.email, permission: true}, SECRET, {expiresIn: "45m"})
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

  //
  

  module.exports = router;