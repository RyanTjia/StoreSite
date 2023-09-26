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
	.then((array) => {
		return array;
	})
	.catch((error) => {
		console.log(error);
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
	.then((array) => {
		return array[0];
	})
	.catch((error) => {
		console.log(error);
	})
}

function getCartQuery(id, requestType, amount) {
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
	.then((array) => {
		return array[0];
	})
	.then((query) => {
		query.amount = amount;
		return query
	})
	.catch((error) => {
		console.log(error);
	})
}

export {getAllQueryByFilter, getSingleQuery, getCartQuery};