import React from "react";
import { useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, TextField, InputAdornment } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SideBar from "../SideBar/sideBar";
import logo from "../../../utils/logo.png";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import { Outlet } from "react-router-dom";

const NavBar = () => {
	const [open, setOpen] = useState(false);
	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};
	return (
		<>
			<AppBar position="static" sx={{ bgcolor: "#010d8a" }}>
				<Toolbar>
					<IconButton edge="start" color="inherit" aria-label="menu" onClick={handleToggle}>
						<MenuIcon />
					</IconButton>
					<Box sx={{ marginLeft: "10px" }}>
						<img src={logo} width="100px" alt="logo" />
					</Box>
					<Typography variant="h6" sx={{ marginLeft: "5px" }}>
						Asset Management System
					</Typography>
					<Box sx={{ flexGrow: 1 }} />
					<TextField
						variant="outlined"
						size="small"
						placeholder="Search by Asset Name"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
							sx: { backgroundColor: "white" },
						}}
					/>
					<IconButton edge="end" sx={{ color: "white", marginLeft: "12px" }}>
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
