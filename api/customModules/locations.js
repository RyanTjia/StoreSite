const {database, objectId} = require("./mongo.js");

const collection = database.collection("Locations");
const fieldLimit = {_id: 1, number: 1, address: 1, state: 1, zipcode: 1};

//Prepares for any searches that the user may want
//Regex expressions are used to compare values with LIKE operator
const prepareFilter = (search) => {
	const filters = [];
	console.log('======================');

	//Splits building number from street
	const tempAddress = search['address'].split(' ');
	const deepSplit = tempAddress[0].split('-');

	/*
	Basically if there is no building number provided, or that it's
	in an incorrect format, the program will assume there's building number
	Furthermore, the symbols "^" and "&" are used to say that the string
	in between them should be exact
	*/
	if (search['address'].length == 0) {
		console.log("No address provided");
	}
	else if (isNaN(+deepSplit[0])) {
		const address = new RegExp(tempAddress.join(' '));
		filters.push({address: {$regex: address, $options: 'i'}});
	}
	else if (search['address'].length > 1) {
		const number = new RegExp(`^${tempAddress.shift()}`);
		const address = new RegExp(`${tempAddress.join(' ')}`);

		filters.push({number: {$regex: number}});
		filters.push({address: {$regex: address, $options: 'i'}});
	}
	else {
		const number = new RegExp(`^${search['address']}`);
		filters.push({number: {$regex: number}});
	}

	//Focusing on whether information for state was provided
	if (search['state'].length == 0) {
		console.log("No state provided");
	}
	else {
		const state = new RegExp(`^${search['state']}`);
		filters.push({state: {$regex: state, $options: 'i'}});
	}

	//Focusing on whether information for zipcode was provided
	if (search['zip'].length == 0) {
		console.log("No zipcode provided");
	}
	else {
		filters.push({zipcode: parseInt(search['zip'])});
	}

	console.log(`The filters are: ${JSON.stringify(filters, null, 4)}`);

	//Final check if this is an all search or filtered search
	return (filters.length > 0) ? filters : [{state: {$regex: /$/}}];
}

async function getAllLocationsByFilter(search) {
	const dataArray = [];
	const queryOptions = {sort: {state: 1}, limit: 10, skip: 0};

	const filter = {$or: prepareFilter(search)};

	try {
	    const result = collection.find(filter, queryOptions).project(fieldLimit);

	    for await (const query of result) {
	    	dataArray.push(query);
	    }
		return dataArray;
	}
	catch(error) {
		console.log(error);
	}
}

async function getLocation(_id) {
	const fieldLimit = {_id: 0, number: 1, address: 1, state: 1, zipcode: 1, beginTime: 1, endTime: 1};
	
	try {
		const result = collection.find({_id: objectId(_id)}).project(fieldLimit);
		
		for await (const query of result) {
			return query;
		}
	}
	catch(error) {
		console.log(error);
	}
}

async function getAllLocationsByProduct(productId) {
	const relationalDB = database.collection("ProductInStore");
	const field = {_id: 0, locationID: 1, stock: 1};
	const dataArray = [];

	try {
		const result = relationalDB.find({productID: productId}).project(field);

		for await (const query of result) {
			const stores = collection.find({_id: objectId(query.locationID)}).project(fieldLimit);

			for await (const store of stores) {
				store.stock = query.stock;
				dataArray.push(store);
			}
		}
		return dataArray;
	}
	catch(error) {
		console.log(error);
	}
}

//==========================================================================

//Export as a json object
module.exports = {
	getAllLocations: () => {
		return getAllLocations();
	},
	getAllLocationsByFilter: (search) => {
		return getAllLocationsByFilter(search);
	},
	getAllLocationsByProduct: (productId) => {
		return getAllLocationsByProduct(productId);
	}
}