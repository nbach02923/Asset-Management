import "./App.css";
import NavBar from "./components/navigation/NavBar/navBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import DashBoard from "./pages/dashBoard";
import Asset from "./pages/asset";
import Login from "./pages/login";
import PrivateRoute from "./utils/privateRoute";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route
					path="/"
					element={
						<PrivateRoute>
							<NavBar />
							<DashBoard />
						</PrivateRoute>
					}
				/>
				<Route
					path="/asset"
					element={
						<PrivateRoute>
							<NavBar />
							<Asset />
						</PrivateRoute>
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;
