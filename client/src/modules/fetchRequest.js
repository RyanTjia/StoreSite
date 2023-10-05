const fetchUrl = 'http://localhost:3001';

function getAllQueryByFilter(querySearch, requestType) {
	return fetch(fetchUrl + `/get${requestType}ByFilter`, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			'search': querySearch
		})
	})
	.then((response) => {
		return response.json();
	})
}

function getSingleQuery(id, requestType) {
	return fetch(fetchUrl + `/get${requestType}`, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			'_id': id
		})
	})
	.then((response) => {
		return response.json();
	})
}

function getLocationsOfProduct(id) {
	return fetch(fetchUrl + '/getLocationsByProduct', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			'_id': id
		})
	})
	.then((response) => {
		return response.json();
	})
}

function getCartQuery(id, amount) {
	return fetch(fetchUrl + '/getProduct', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			'_id': id
		})
	})
	.then((response) => {
		return response.json();
	})
	.then((query) => {
		query.amount = amount;
		return query
	})
}

export {getAllQueryByFilter, getSingleQuery, getLocationsOfProduct, getCartQuery};