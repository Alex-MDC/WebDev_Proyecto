const { default: axios } = require("axios");
const { response } = require("express");

//hacer npm i express
var express = require("express");
var path = require("path");
//passinf script stuff
//hay que hacer npm i axios
var axios = require("axios");
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// DATA
// =============================================================

// Routes
// =============================================================
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "home.html"));
  });

  //DYNAMIC ROUTE--------------------------------DYNAMIC ROUTE
app.get("/:requestID", function (req,res) {
    if(req.params.requestID == "login"){
        res.sendFile(path.join(__dirname, "login.html"));
    }else if(req.params.requestID == "signup"){
      res.sendFile(path.join(__dirname, "signup.html"));
    }else if(req.params.requestID == "userpage"){
      res.sendFile(path.join(__dirname, "userpage.html"));
    }else if(req.params.requestID == "gameinfo"){
      res.sendFile(path.join(__dirname, "gameinfo.html"));
    }

})


   // Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });

  //funcion para tener en home los top games
  function populateTopGames(){

  } 

  //API stuff
  //$(document).ready(function(){
  function getTopRatedGames(classToAdd, appendingID){
 // $(document).ready(function(){
    console.log("executing API stuff");
    const options = {
      method: 'POST',
      url: 'https://api.igdb.com/v4/games',
      headers: {
        'Client-ID': '8xmlvh16op42w7i239g2aimpfxj0av',
        Authorization: 'Bearer i4kb6g0xsmkvicxrwnhg71xvxkuv4m'
      },
      data: 'f name,first_release_date,release_dates.date,release_dates.human,rating, rating_count;\n\nwhere rating >= 90 & first_release_date >=1514768461 & rating_count > 100 & first_release_date <= 1609462861;\nsort first_release_date desc;\nlimit 15;\n\n'
    };
    
    //cambiar respuesta a respuestaAPI
    var respuestaAPI
    var results
    axios.request(options).then(function (response) {
        console.log(response.data);
        console.log(response.data.length)
        results = response.data
        //
        for( var i=0;i<results.length; i++)
        {
        // contenido que queremos
        //  var gameDiv = $("<div class=\"game-item\">");
          var gameDiv = $("<div>");
          gameDiv.addClass(classToAdd)
          var rating = results[i].rating
          var gameName = results[i].name
          // pedir el game cover resulta muy complicado atm
          var p = $("<p>").text("Rating: "+rating)
          var p2 = $("<p>").text("Title: " +gameName)
          //crear estructura del item juego
          gameDiv.append(p2)
          gameDiv.append(p)
          //
          //pasar el elemento completo a la pagina
          $(appendingID).append(gameDiv)

        }
        //
      }).catch(function (error) {
        console.error(error);
      });
     

   // }); //doc ready close
  }
    
  getTopRatedGames("top-rated-game","#top-rated")
  
    

  //--------------
  
  
  //lo que iria en el home.ejs
  /*
  <% for (var i= 0;i < games.length; i++) { %>
    <tr>
      <!-- -->
      <div class="blog-post">
        <h2 class="blog-post-title"> <%= resultsAPI[i].title %> </h2>
        <p class="blog-post-meta"><%= resultsAPI[i].rating %>  by <a href="#"> </p>
    

      </div>
      <!-- -->
  </tr>

  <% } %>
  */

  