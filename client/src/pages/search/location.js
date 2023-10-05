import {useState} from "react";
import {useQuery} from "react-query";
import {getAllQueryByFilter} from "../../modules/fetchRequest";

function parseLocations(array) {
	if (array.length === 0) {
		return <h3 className="col-md-12">Whoops! Cannot find it</h3>
	}
	return (
		<div className="col-md-12 list-group">
            {array.map((element) => (
				<div className='list-group-item' key = {element['_id']}>
					<div className="row">
						<div className="col-md-12">
							<b>{element['number']} {element['address']}</b>
						</div>
					</div>
					<div className="row">
						<div className="col-md-12">
							{element['state']}, {element['zipcode']}
						</div>
					</div>
				</div>
			))}
        </div>
	)
}

const Result = (props) => {
	const {data, status} = useQuery(["inventory", props.data], () => getAllQueryByFilter(props.data, 'Locations'));

	return (
		<>
			{status === "error" && <h3 className="col-md-12">Connection not established, please try again later</h3>}
            {status === "loading" && <div className="col-md-12">Loading...</div>}
            {status === "success" && (parseLocations(data))}
		</>
	)
}

const Location = () => {
	const [search, setSearch] = useState({address: '', state: '', zip: ''});

	const handleSubmit = (event) => {
		event.preventDefault();

		const inputArray = event.target;
		const dataObject = {};

		for (let i = 0; i < inputArray.length - 1; i++) {
			const inputId = inputArray[i].id;
			const inputValue = inputArray[i].value;
			dataObject[inputId] = inputValue;
		}
		setSearch(dataObject);
	}

	return (
		<>
			<div className="row">
				<div className="col-md-12">
					<form className='form-inline' onSubmit = {handleSubmit}>
						<label className='control-label' htmlFor='address'>Address:</label>
						<input className='form-control' type='text' id='address'/>
						<label className='control-label' htmlFor='state'>State:</label>
						<input className='form-control' type='text' maxLength='2' id='state'/>
						<label className='control-label' htmlFor='zip'>Zipcode:</label>
						<input className='form-control' type='number' id='zip'/>
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

export default Location;