const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');

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
/*
app.use(express.static(__dirname+'/public'))
//app.set('/views',path.join(__dirname,'/views'))
app.use('/images', express.static('images'));
*/
// routes
app.use('/', indexRoutes);

app.listen(app.get('port'), () =>{
    console.log(`server on port ${app.get('port')}`);
})


