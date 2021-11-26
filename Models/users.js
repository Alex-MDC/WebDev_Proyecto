// # 1
var mongoose = require("mongoose")
var Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
var Reviews = require("./reviews")

// # 2
var UserSchema = Schema ({
    email: String,
    password: String,
   // user_id: String,
    //favorite games hold the GameID for further API requests
    favoriteGames:[],
    reviewList: [Reviews.schema]
    }
);


// # 3
module.exports = mongoose.model('users', UserSchema);