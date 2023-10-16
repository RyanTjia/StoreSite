import {useState, useContext, createContext, useRef} from "react";
import {useQuery} from "react-query";
import {Link} from "react-router-dom";

import {getCartQuery} from "../modules/fetchRequest";

const GlobalContext = createContext();
const globalTotal = {};

//Returns only the id & amount of each product
function gatherList() {
    const currentList = JSON.parse(localStorage.cart);
    const productsID = currentList.map((product) => {
        return [product._id, product.amount];
    });

    return productsID;
}

const SubmitOrder = () => {
    const [test, setTest] = useState(0);
    const globalFunction = useContext(GlobalContext);

    globalFunction.current = () => {
        const tick = Math.random();
        setTimeout(() => setTest(tick), 250);
    };

    const costArray = Object.values(globalTotal);
    const total = costArray.reduce((sum, currentValue) => sum + currentValue, 0);

    return (
        <div className="row">
            <div className="col-md-12">
                <button className="btn btn-info">Check Total</button>
                <span>${total.toFixed(2)}</span>
            </div>
        </div>
    )
}

const ChangeAmount = (props) => {
    const value = props.value;
    const [amount, setAmount] = useState(value.amount);
    const totalPrice = value.price * amount;

    const siblingFunction = useContext(GlobalContext);
    globalTotal[value._id] = totalPrice;
    siblingFunction.current();

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
    const data = props.data;

    //This is a failsafe, for when the fetch is a success but the product is not there
    if (data.length === 0) {
        return <b>Error! Unable to retrieve product!</b>
    }
    return (
        <div className="row">
            <div className="col-md-6">
                <img alt="Placeholder here" className="img-responsive"/>
            </div>
            <div className="col-md-6">
                <div className="row">
                    <Link to='../done' state={{id: data._id}}>
                        <div className="col-md-12">
                            <h1>{data.product}</h1>
                        </div>
                    </Link>
                </div>
                <ChangeAmount value={data}/>
            </div>
        </div>
    )
}

const Fetcher = (props) => {
    const info = props.product;
    const {data, status} = useQuery(info[0], () => getCartQuery(info[0], info[1]));

    return (
        <>
            {status === "error" && <h3 className="col-md-12">Connection not established, please try again later</h3>}
            {status === "loading" && <div className="col-md-12">Loading...</div>}
            {status === "success" && <CartProduct data={data}/>}
        </>
    )
}

const Cart = () => {
    const savedCart = gatherList();
    const sharedFunction = useRef();

	return (
        <GlobalContext.Provider value={sharedFunction}>
            <div className="row">
                <div className="col-md-12 list-group">
                    {savedCart.map((product) => (
                        <div className="list-group-item" key={product[0]}>
                            <Fetcher product={product}/>
                        </div>
                    ))}
                </div>
            </div>
            <SubmitOrder/>
        </GlobalContext.Provider>
	)
}

export default Cart;