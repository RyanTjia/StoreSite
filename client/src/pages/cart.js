import {useState, useEffect} from "react";
import {Link} from "react-router-dom";

import {getCartQuery} from "../modules/fetchRequest";

//Returns only the id & amount of each product
function gatherList() {
    const currentList = JSON.parse(localStorage.cart);
    const productsID = currentList.map((product) => {
        return [product._id, product.amount];
    });

    return productsID;
}

function buildResponse(data) {
    const modifiedArray = data.map((element) => {
        const value = element.value;

        if (value === undefined) {
            return (
                <div className="list-group-item" key={data.indexOf(element)}>
                    <div className="row">
                        <div className="col-md-12">
                            <b>Error! Unable to retrieve product!</b>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className='list-group-item' key={value._id}>
                    <div className="row">
                        <div className="col-md-6">
                            <img alt="Placeholder here" className="img-responsive"/>
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-12">
                                    <Link to='../done' state={{id: value._id}}>
                                        <h1>{value.product}</h1>
                                    </Link>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    ${Number(value.price).toFixed(2)} X {value.amount}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    });

    return modifiedArray;
}
//Must return a list of queried items
//Each item is a different query

const Cart = () => {
	const [list, setList] = useState(<div className="col-md-12">Loading...</div>);

	useEffect(() => {
        const currentList = gatherList();
        const fetches = currentList.map((product) => {
            return getCartQuery(product[0], 'Product', product[1]);
        });
        console.log(fetches)

        Promise.allSettled(fetches).then((product) => {
            const newArray = buildResponse(product);

            if (newArray.length > 0) {
				setList(newArray);
			}
			else {
				setList(<h3 className="col-md-12">Whoops! Cannot find it</h3>);
			}
        })
		.catch((error) => {
            console.log(error);
			setList(<h3 className="col-md-12">Connection not established, please try again later</h3>);
		})

		/*fetch.then((response) => {
			const newArray = buildResponse(response);
			
			if (newArray.length > 0) {
				setQuery(newArray);
			}
			else {
				setQuery(<h3 className="col-md-12">Whoops! Cannot find it</h3>);
			}
		})*/
	}, []);

	return (
		<div className="col-md-12 list-group">
			{list}
		</div>
	)
}

export default Cart;