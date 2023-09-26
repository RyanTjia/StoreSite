var express = require('express');
var router = express.Router();

const local = require('./database.js');

router.get('/', function(req, res) {
	res.render('index', local.model);
});

router.post('/addProduct', function(req, res) {
	const {item, price, desc, category} = req.body;

	const object = {
		product: item,
		price: Number(price),
		description: desc,
		category: category,
		locations: []
	};

	var fetch = local.addProduct(object);
	fetch.then(() => {
		res.redirect('/');
	});
});

router.post('/addLocation', function(req, res) {
	const {building, address, state, zipcode, beginTime, endTime} = req.body;

	const object = {
		number: building,
		address: address,
		state: state,
		zipcode: Number(zipcode),
		beginTime: beginTime,
		endTime: endTime
	};

	var fetch = local.addLocation(object);
	fetch.then(() => {
		res.redirect('/');
	});
});

router.post('/linkProduct', function(req, res) {
	const {item, amount, location} = req.body;

	const object = {
		productID: item,
		locationID: location,
		stock: amount
	};

	var fetch = local.linkProduct(object);
	fetch.then(() => {
		res.redirect('/');
	});
})

router.post('/removeProduct', function(req, res) {
	const {chosenItem, availablePlace} = req.body;

	//Converts it into an array just in case
	let locations = (Array.isArray(availablePlace) ? availablePlace : [availablePlace]);

	//Different operations if we should remove the product itself or from certain locations
	if (locations.includes("all")) {
		locations = [];
	}

	var fetch = local.removeProduct(chosenItem, locations);
	fetch.then(() => {
		res.redirect('/');
	});
});

router.post('/removeLocation', function(req, res) {
	const {location} = req.body;

	var fetch = local.removeLocation(location);
	fetch.then(() => {
		res.redirect('/');
	});
});

router.get('/test', function(req, res) {
	res.json(productDB);
});

router.get('/getLinks/:productID', function(req, res) {
	const logic = req.params['productID'];
	const result = local.getLinks(logic);

	res.send(result);
})

module.exports = router;