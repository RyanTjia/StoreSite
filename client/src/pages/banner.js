import {Outlet, Link} from "react-router-dom";
import {useState} from "react";

function parseProducts() {
	let newArray = "";

	//For when the user did not saved any products
	if (localStorage.cart === undefined) {
		return "";
	}
	else {
		console.log(JSON.parse(localStorage.cart));
		const oldArray = JSON.parse(localStorage.cart);

		newArray = oldArray.map((product) => {
			return (
				<div className="list-group-item" key={product._id}>
					{product.name} <b>X</b> {product.amount}
				</div>
			)
		});
	}

	return newArray;
}

const CartButton = () => {
	const [list, setList] = useState("");

	function closeCart() {
		setList("");
	}

	function checkCart() {
		if (list === "") {
			const cartList = parseProducts();
			cartList.push(<Link to = "/cart" key="view"><button className="btn" onClick={closeCart}>View Cart</button></Link>);

			const cart = <div className="col-md-12 list-group" id="testing">{cartList}</div>;
			setList(cart);
		}
		else {
			setList("");
		}
	}

	return (
		<span className="cartParent">
			<button className="cart btn" onClick={checkCart}>
				Cart
			</button>
			{list}
		</span>
	)
};

const Banner = () => {
	const [input, setInput] = useState({type: 'inventory'});

	//==========================================================================================
	//Rendering
	return (
		<>
			<div className="row">
				<h1 className="col-md-12">
					Shop-A-Lot
				</h1>
			</div>
			<div className="row navBar">
				<div className="col-md-12">
					<Link to = "/"><button className="btn">Home</button></Link>
					<Link to = "/inventory"><button className="btn">Products</button></Link>
					<Link to = "/locations"><button className="btn">Locations</button></Link>
					<CartButton/>
				</div>
			</div>

			<Outlet/>
		</>
	)
};

export default Banner;