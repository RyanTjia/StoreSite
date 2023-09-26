var express = require('express');
var router = express.Router();

//External file for functions
const productCRUD = require('./products.js');
const locationCRUD = require('./locations.js');

router.get('/getApi', (req, res) => {
	res.send('API is working');
});

router.post('/getInventoriesByFilter', (req, res) => {
	const {search} = req.body;

	var test = productCRUD.getAllProductsByFilter(search);
	test.then((response) => {
		res.json(response);
	});
});

router.post('/getProduct', (req, res) => {
	const {_id} = req.body;

	var test = productCRUD.getProduct(_id);
	test.then((response) => {
		res.json(response);
	});
});

router.post('/getLocationsByFilter', (req, res) => {
	const {search} = req.body;
	
	var test = locationCRUD.getAllLocationsByFilter(search);
	test.then((response) => {
		res.json(response);
	});
});

module.exports = router;