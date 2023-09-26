import {useState, useEffect} from "react";
import {Link} from "react-router-dom";

import {getAllQueryByFilter} from "../../modules/fetchRequest";

function buildResponse(data) {
	const modifiedArray = data.map((element) => {
		return (
			<div className='list-group-item' key = {element['_id']}>
				<div className="row">
					<div className="col-md-12">
						<img alt="Placeholder here" className="img-responsive"/>
					</div>
				</div>
				<Link to='../done' state={{id: element['_id']}}>
					<div className="row">
						<div className="col-md-12">
							<b>{element['product']} - ${Number(element['price']).toFixed(2)}</b>
						</div>
					</div>
				</Link>
			</div>
		)
	});

    return modifiedArray;
}

const Result = (props) => {
	const [query, setQuery] = useState(<div className="col-md-12">Loading...</div>);

	useEffect(() => {
		const fetch = getAllQueryByFilter(props.data, 'Inventories');

		fetch.then((response) => {
			const newArray = buildResponse(response);
			
			if (newArray.length > 0) {
				setQuery(newArray);
			}
			else {
				setQuery(<h3 className="col-md-12">Whoops! Cannot find it</h3>);
			}
		})
		.catch(() => {
			setQuery(<h3 className="col-md-12">Connection not established, please try again later</h3>);
		})
	}, [props.data]);

	return (
		<div className="col-md-12 list-group">
			{query}
		</div>
	)
}

const Inventory = () => {
	const [search, setSearch] = useState({product: ''});

	const handleSubmit = (event) => {
		event.preventDefault();

		const inputArray = event.target;
		const dataObject = {};

		for (let i = 0; i < inputArray.length - 1; i++) {
			const inputId = inputArray[i].id;
			const inputValue = inputArray[i].value;
			dataObject[inputId] = inputValue;
		}
		console.log(dataObject);
		setSearch(dataObject);
	}

	return (
		<>
			<div className="row">
				<div className="col-md-12">
					<form className="form-inline" onSubmit = {handleSubmit}>
						<label className='control-label' htmlFor='product'>Product:</label>
						<input className='form-control' type='text' id='product'/>
						<input className='btn btn-primary' type='submit'/>
					</form>
				</div>
			</div>
			<div className="row">
				<Result data = {search}/>
			</div>
		</>
	)
}

export default Inventory;