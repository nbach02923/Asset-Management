import "./App.css";
import NavBar from "./components/navigation/NavBar/navBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import DashBoard from "./pages/dashBoard";
import Asset from "./pages/asset/asset";
import Login from "./pages/login";
import PrivateRoute from "./utils/privateRoute";
import Category from "./pages/category/category";
import User from "./pages/user/user";
import Department from "./pages/department/department";
import Position from "./pages/position/position";
import Profile from "./pages/profile/profile";
import Allocation from "./pages/allocation/allocation"

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/" element={<PrivateRoute />}>
					<Route element={<NavBar />}>
						<Route index element={<DashBoard />} />
						<Route path="/asset" element={<Asset />} />
						<Route path="/system/category" element={<Category />} />
						<Route path="/system/user" element={<User />} />
						<Route path="/system/department" element={<Department />} />
						<Route path="/system/position" element={<Position />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/register/assetAllocation" element={<Allocation />} />
					</Route>
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
