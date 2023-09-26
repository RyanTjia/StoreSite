var express = require('express');

var routes = require('./customModules/routes.js');
var app = express();

//Allows the use of data retrieved through the body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//npm install pug
app.set('views', './customModules');
app.set('view engine', 'pug');

app.use('/', routes);
app.use('/code', express.static('./customModules'));
module.exports = app;