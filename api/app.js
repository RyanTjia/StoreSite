var express = require('express');
var cors = require('cors');

var routes = require('./customModules/routes.js');
var app = express();

//CORS policy
app.use(cors());

//Allows the use of data retrieved through the body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', routes);
module.exports = app;