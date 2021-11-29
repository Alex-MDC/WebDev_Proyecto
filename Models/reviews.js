// # 1
var mongoose = require("mongoose")
var Schema = mongoose.Schema;
const bcrypt = require("bcrypt");


// # 2
var ReviewSchema = Schema ({
    reviewContent: String,
    score: String,
    imageURL: String,
    gameID: String,
    user: String,
    date: Date,
    user_id: String,
    reviewed: {
        type: Boolean,
        default: false
    }
    }
);


// # 3
module.exports = mongoose.model('reviews', ReviewSchema);