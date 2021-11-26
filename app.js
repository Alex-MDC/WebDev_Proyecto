const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');

const app = express();

// connection to db

mongoose.connect('mongodb://localhost/VideoGameProject')
    .then(db => console.log('db connected'))
    .catch(err => console.log(err));

// importing routes
const indexRoutes = require('./routes/routeindex');
const exp = require('constants');
const { dirname } = require('path');


// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.static('public'))
//
//es necesario usar el encoded en true?
// app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

//
// routes
app.use('/', indexRoutes);

app.listen(app.get('port'), () =>{
    console.log(`server on port ${app.get('port')}`);
})


