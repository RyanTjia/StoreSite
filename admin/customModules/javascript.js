window.onload = () => {
	const defaultProduct = document.querySelector("#chosenItem").value;
	fetchRelatedLocations(defaultProduct);

	document.querySelector("#chosenItem").addEventListener("change", () => {
		const chosenProduct = document.querySelector("#chosenItem").value;
		fetchRelatedLocations(chosenProduct);
	});
}

function fetchRelatedLocations(productID) {
	if (productID == '') {
		return;
	}

	fetch(`/getLinks/${productID}`)
	.then((response) => {
		return response.json();
	})
	.then((array) => {
		updateList(array);
	})
	.catch((error) => {
		console.log(error);
	})
}

function updateList(array) {
	let listElement = document.querySelector("#availablePlace");
	listElement.innerHTML = '<option value="all">All</option>';

	array.forEach((data) => {
		const place = `<option value=${data._id}>${data.number} ${data.address}, ${data.state}, ${data.zipcode}</option>`
		listElement.innerHTML = listElement.innerHTML + place;
	})
}