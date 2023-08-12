import "./App.css";
import NavBar from "./components/navigation/NavBar/navBar";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import DashBoard from "./pages/dashBoard";
import Asset from "./pages/asset";
import Login from "./pages/login";
import ErrorPopup from "./components/popup";

const PrivateRoute = ({ children }) => {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const hasToken = localStorage.getItem("token");
	useEffect(() => {
		if (!hasToken) {
			setOpen(true);
		}
	}, [hasToken]);
	const handleClose = () => {
		setOpen(false);
		navigate("/login");
	};
	const message = "You are not allowed to access this page. Please login to continue.";
	const status = 401;
	return (
		<>
			{children}
			<ErrorPopup open={open} handleClose={handleClose} statusCode={status} message={message} />
		</>
	);
};

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route element={<NavBar />}>
					<Route
						path="/"
						element={
							<PrivateRoute>
								<DashBoard />
							</PrivateRoute>
						}
					/>
					<Route
						path="/asset"
						element={
							<PrivateRoute>
								<Asset />
							</PrivateRoute>
						}
					/>
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
