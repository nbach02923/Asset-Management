import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Popup from "../components/popup";

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
			<Popup.ErrorPopup open={open} handleClose={handleClose} statusCode={status} message={message} />
			<Outlet />
		</>
	);
};
export default PrivateRoute;
