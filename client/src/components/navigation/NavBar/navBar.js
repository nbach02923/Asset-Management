import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, TextField, InputAdornment, Tooltip, Zoom } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SideBar from "../SideBar/sideBar";
import logo from "../../../logo.svg";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import { Outlet, useNavigate } from "react-router-dom";

const NavBar = () => {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};
	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};
	return (
		<>
			<AppBar position="static" sx={{ bgcolor: "#010d8a" }}>
				<Toolbar>
					<IconButton edge="start" color="inherit" aria-label="menu" onClick={handleToggle}>
						<MenuIcon />
					</IconButton>
					<Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
						<Box sx={{ marginLeft: "10px" }}>
							<img src={logo} width="100px" alt="logo" />
						</Box>
						<Typography variant="h6" sx={{ marginLeft: "5px" }}>
							Asset Management System
						</Typography>
					</Box>
					<Box sx={{ flexGrow: 1 }} />
					<TextField
						variant="outlined"
						size="small"
						placeholder="Search by Asset Name or Asset Serial"
						sx={{ width: "400px" }}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
							sx: { backgroundColor: "white" },
						}}
					/>
					<Tooltip title="Logout" TransitionComponent={Zoom}>
						<IconButton edge="end" sx={{ color: "white", marginLeft: "12px" }} onClick={handleLogout}>
							<LogoutIcon />
						</IconButton>
					</Tooltip>
				</Toolbar>
			</AppBar>
			<SideBar open={open} setOpen={setOpen} />
			<Outlet />
		</>
	);
};
export default NavBar;
