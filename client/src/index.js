import ReactDOM from "react-dom/client";

//Routing dependencies
import {Navigate, BrowserRouter, Routes, Route} from "react-router-dom";

//Import routes from external files
import Banner from "./pages/banner";
import Home from "./pages/home";

import Inventory from "./pages/search/inventory";
import Product from "./pages/search/product";

import Cart from "./pages/cart";

import Location from "./pages/search/location";

//Importing custom CSS
import "./modules/style.css";

//React query for efficiency
import {QueryClient, QueryClientProvider} from "react-query";
const queryClient = new QueryClient();

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
            <BrowserRouter>
				<Routes>
					<Route path = "/" element = {<Banner/>}>
						<Route index element = {<Home/>}/>
						<Route path = "inventory" element = {<Inventory/>}/>
						<Route path = "done" element = {<Product/>}/>
						<Route path = "locations" element = {<Location/>}/>
						<Route path = "cart" element = {<Cart/>}/>
					</Route>
					<Route path = "*" element = {<Navigate to = "/" replace = {true}/>}/>
				</Routes>
			</BrowserRouter>
        </QueryClientProvider>
	);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);