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

const ChangeAmount = (props) => {
    const value = props.value;
    const [amount, setAmount] = useState(value.amount);
    const totalPrice = value.price * amount;

    function changeAmount(event) {
        setAmount(event.target.value);
    }

    return (
        <div className="row">
            <div className="col-md-3">
                ${Number(value.price).toFixed(2)}
            </div>
            <div className="col-md-1">
                X
            </div>
            <div className="col-md-3">
                <input className='form-control'
                    type="number"
                    min={1} step={1}
                    value={amount}
                    onChange={changeAmount}
                />
            </div>
            <div className="col-md-1">
                =
            </div>
            <div className="col-md-4">
                ${totalPrice.toFixed(2)}
            </div>
        </div>
    )
}

const CartProduct = (props) => {
    const item = props.value;

    return (
        <div className="row">
            <div className="col-md-6">
                <img alt="Placeholder here" className="img-responsive"/>
            </div>
            <div className="col-md-6">
                <div className="row">
                    <Link to='../done' state={{id: item._id}}>
                        <div className="col-md-12">
                            <h1>{item.product}</h1>
                        </div>
                    </Link>
                </div>
                <ChangeAmount value={item}/>
            </div>
        </div>
    )
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
                    <CartProduct value={value}/>
                </div>
            )
        }
    });

    return modifiedArray;
}

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
	}, []);

	return (
		<div className="col-md-12 list-group">
			{list}
		</div>
	)
}

export default Cart;