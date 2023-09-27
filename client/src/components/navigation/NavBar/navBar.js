import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SideBar from "../SideBar/sideBar";
import logo from "../../../logo.svg";
import LogoutIcon from "@mui/icons-material/Logout";
import { Outlet, useNavigate } from "react-router-dom";
import decodeJWT from "../../../utils/decodeJWT";
import API from "../../../services/request";

const NavBar = () => {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [avatar, setAvatar] = useState("");
	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};
	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};
	const decoded = decodeJWT();
	const userName = decoded.userName;
	useEffect(() => {
		API.getAPI("/user", { id: decoded.id }).then((response) => {
			const avatar = response.data.user.userInformation ? response.data.user.userInformation.avatarPath : "";
			setAvatar(avatar);
		});
	}, [decoded.id]);
	return (
		<>
			<AppBar position="static" sx={{ bgcolor: "#010d8a" }}>
				<Toolbar>
					<IconButton color="inherit" aria-label="menu" onClick={handleToggle}>
						<MenuIcon />
					</IconButton>
					<Box
						sx={{ display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}
						onClick={() => navigate("/")}>
						<img src={logo} width="100px" alt="logo" />
						<Typography variant="h6" sx={{ marginLeft: "5px" }}>
							Asset Management System
						</Typography>
					</Box>
					<Box sx={{ flexGrow: 1 }} />
					<Box
						onClick={() => navigate("/profile")}
						sx={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							cursor: "pointer",
						}}>
						<Typography sx={{ mr: 1 }}>{userName}</Typography>
						<Avatar alt="avatar" src={avatar} imgProps={{ crossOrigin: "anonymous" }} />
					</Box>
					<IconButton sx={{ color: "white", marginLeft: "12px" }} onClick={handleLogout}>
						<LogoutIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
			<SideBar open={open} setOpen={setOpen} />
			<Outlet />
		</>
	);
};
export default NavBar;
