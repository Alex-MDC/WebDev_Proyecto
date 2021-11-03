var express = require("express");
var path = require("path");
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
    }

})
   // Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
  