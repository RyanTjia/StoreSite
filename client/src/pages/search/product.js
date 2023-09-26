import {useState, useEffect, useContext, createContext} from "react";
import {useLocation} from "react-router-dom";

import {getSingleQuery} from "../../modules/fetchRequest";

const GlobalContext = createContext();

const AddToCart = () => {
    const item = useContext(GlobalContext);
    const [amount, setAmount] = useState(1);

    const userPrice = Number(item.price) * Number(amount);

    function changeAmount(input) {
        const potentialAmount = Number(amount) + Number(input);

        if (potentialAmount > 0) {
            setAmount(potentialAmount);
        }
    }

    function addItem() {

        //Only stores the id and the amount
        //The rest will be retrieved by the API
        const productObject = {
            "_id": item._id,
            "name": item.product,
            "amount": Number(amount)
        }
        
        //If cart is empty, then simply initialize
        //Otherwise, add on to it
        const cartArray = JSON.parse(localStorage.getItem("cart"));

        if (cartArray === null) {
            localStorage.setItem("cart", JSON.stringify([productObject]));
        }

        else {
            cartArray.push(productObject);
            localStorage.setItem("cart", JSON.stringify(cartArray));
        }
    }

    return (
        <>
            <div className="row">
                <div className="col-md-12" id='price'>
                    Your Price ${userPrice.toFixed(2)}
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-12">
                            <input className='form-control' type='number' id='amount' value={amount} readOnly/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <button type="button" className="btn btn-success" onClick={() => changeAmount(1)}>
                                +
                            </button>
                            <button type="button" className="btn btn-danger" onClick={() => changeAmount(-1)}>
                                -
                            </button>
                            <button type="button" className="btn btn-info" onClick={addItem}>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const ProductInfo = () => {
    const item = useContext(GlobalContext);

    return (
        <>
            <div className='row'>
                <div className="col-md-8 customBox">
                    <img alt="Placeholder here" className="img-responsive"/>
                </div>
                <div className="col-md-4">
                    <div className="row">
                        <h1 className="col-md-12">{item.product}</h1>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            Original Price ${Number(item.price).toFixed(2)}
                        </div>
                    </div>
                    <AddToCart/>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <b>Description:</b> {item.description}
                </div>
            </div>
        </>
    );
}

const Product = () => {
    const {state} = useLocation();
    const [product, setProduct] = useState(<div className="col-md-12">Loading...</div>);

	useEffect(() => {
		const fetch = getSingleQuery(state.id, 'Product');

		fetch.then((response) => {
            const parsedData = (
                <GlobalContext.Provider value={response}>
                    <ProductInfo/>
                </GlobalContext.Provider>
            )
            setProduct(parsedData);
		})
        .catch(() => {
			setProduct(<h3 className="col-md-12">Connection not established, please try again later</h3>);
		})
	}, [state]);

    return (
        <div className="row">
            <div className="col-md-10 mx-auto">
                {product}
            </div>
        </div>
    )
}

export default Product;