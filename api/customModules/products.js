const {database, objectId} = require("./mongo.js");

const collection = database.collection("Inventories");

//Prepares for any searches that the user may want
//Regex expressions are used to compare values with LIKE operator
const prepareFilter = (search) => {
	const filters = [];
	console.log('======================');

	//Focusing on whether the user provided the name of the product
	if (search['product'].length == 0) {
		console.log("No product name provided");
	}
	else {
		const product = new RegExp(search['product']);
		filters.push({product: {$regex: product, $options: 'i'}});
	}

	console.log(`The filters are: ${JSON.stringify(filters, null, 4)}`);

	//Final check if this is an all search or filtered search
	return (filters.length > 0) ? filters : [{product: {$regex: /$$/}}];
}

async function getAllProductsByFilter(search) {
	const dataArray = [];

	const fieldLimit = {_id: 1, product: 1, price: 1, category: 1};
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

async function getProduct(_id) {
	const data = [];
	const fieldLimit = {_id: 1, product: 1, price: 1, description: 1, category: 1};
	try {
		const result = collection.find({_id: objectId(_id)}).project(fieldLimit);
		
		for await (const query of result) {
			data.push(query);
		}
		return data;
	}
	catch(error) {
		console.log(error);
	}
}

//Export as a json object
module.exports = {
	getAllProductsByFilter: (search) => {
		return getAllProductsByFilter(search);
	},
	getProduct: (_id) => {
		return getProduct(_id);
	}
}