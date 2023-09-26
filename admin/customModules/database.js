const {client, database, objectId} = require('./mongo.js');

//Temporary database
const productDB = [];
const locationDB = [];
let linksDB = [];

async function initializeLocalData() {
	const inventories = database.collection("Inventories");
	const locations = database.collection("Locations");
	const links = database.collection("ProductInStore");

	console.log("Gathering data...");
	try {
		//await client.connect;

		const products = await inventories.find({}).project({_id: 1, product: 1});
		const stores = await locations.find({}).project({_id: 1, number: 1, address: 1, state: 1, zipcode: 1});
		const connections = await links.find({}).project({_id: 0, productID: 1, locationID: 1});

		for await (const query of products) {
			productDB.push(query);
		}

		for await (const query of stores) {
			locationDB.push(query);
		}

		for await (const query of connections) {
			linksDB.push(query);
		}
	}
	catch(error) {
		console.log(error);
	}
	finally {
		console.log("Data retrieved!");
	}
}

async function addProduct(object) {
	const collection = database.collection("Inventories");

	try {
		const result = await collection.insertOne(object);

		if (result.insertedId != null) {
			const newItem = {
				_id: result.insertedId,
				product: object.product,
				locations: []
			};
			productDB.push(newItem);
		}
	}
	catch(error) {
		console.log(error);
	}
	finally {
		return true;
	}
}

async function addLocation(object) {
	const collection = database.collection("Locations");

	try {
		const result = await collection.insertOne(object);

		if (result.insertedId != null) {
			const newPlace = {
				_id: result.insertedId,
				number: object.number,
				address: object.address,
				state: object.state,
				zipcode: object.zipcode
			};
			locationDB.push(newPlace);
		}
	}
	catch(error) {
		console.log(error);
	}
	finally {
		return true;
	}
}

async function linkProduct(object) {
	const collection = database.collection("ProductInStore");

	try {
		const result = await collection.insertOne(object);

		if (result.insertedId != null) {
			const newLink = {
				productID: object.productID,
				locationID: object.locationID
			};
			linksDB.push(newLink);
		}
	}
	catch(error) {
		console.log(error);
	}
	finally {
		return true;
	}
}

async function removeLinks(query) {
	const links = database.collection("ProductInStore");

	await query.forEach(object => {
		links.deleteMany(object);
	});
}

async function removeProduct(item, locations) {
	const collection = database.collection("Inventories");
	const links = database.collection("ProductInStore");
	let query = [{
		productID: item,
		locationID: {$regex: /$/}
	}];

	if (locations.length > 0) {
		query = locations.map((place) => {
			linksDB = linksDB.filter(object => {
				return object.locationID != place || object.productID != item;
			});

			return {
				productID: item,
				locationID: place
			}
		});
	}
	else {
		linksDB = linksDB.filter(object => {
			return object.productID != item;
		});
	}

	try {
		await removeLinks(query);

		if (locations.length == 0) {
			const result = await collection.deleteOne({_id: objectId(item)});

			if (result.deletedCount > 0) {
				const productParent = productDB.find(product => product._id == item);
				const productIndex = productDB.indexOf(productParent);

				productDB.splice(productIndex, 1);
			}
		}
	}
	catch(error) {
		console.log(error);
	}
	finally {
		return true;
	}
}

async function removeLocation(location) {
	const locations = database.collection("Locations");
	const query = [{
		productID: {$regex: /$/},
		locationID: location
	}];

	linksDB = linksDB.filter(object => {
		return object.locationID != location;
	});

	try {
		await removeLinks(query);

		const result = await locations.deleteOne({_id: objectId(location)});

		if (result.deletedCount > 0) {
			const removedLocation = locationDB.find(place => place._id == location);
			const locationIndex = locationDB.indexOf(removedLocation);

			locationDB.splice(locationIndex, 1);
		}
	}
	catch(error) {
		console.log(error);
	}
	finally {
		return true;
	}
}

function getLinks(productId) {
	const locationIDs = linksDB.filter(object => {
		return object.productID == productId;
	});

	const locations = [];
	locationIDs.forEach((place) => {
		const chosenLocation = locationDB.find(object => object._id == place.locationID);
		locations.push(chosenLocation);
	});

	return locations;
}

module.exports = {
	initialize: () => {
		initializeLocalData();
	},
	addProduct: (object) => {
		return addProduct(object);
	},
	addLocation: (object) => {
		return addLocation(object);
	},
	linkProduct: (object) => {
		return linkProduct(object);
	},
	removeProduct: (item, locations) => {
		return removeProduct(item, locations);
	},
	removeLocation: (location) => {
		return removeLocation(location);
	},
	getLinks: (productId) => {
		return getLinks(productId);
	},
	model: {
		product: productDB,
		location:locationDB
	}
}