import React from "react";
import { Box, Container, TextField, Button, InputAdornment, IconButton } from "@mui/material";
import Popup from "../../components/popup";
import backgroundImage from "../../utils/background.jpg";
import logo from "../../logo.svg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import useLoginState from "./useLoginState";

const Login = () => {
	const {
		userName,
		password,
		openSuccess,
		openError,
		status,
		message,
		countdown,
		showPassword,
		handleClickShowPassword,
		handleMouseDownPassword,
		handleCloseSuccess,
		handleCloseError,
		handleLogin,
		setUserName,
		setPassword,
	} = useLoginState();
	return (
		<>
			<Popup.SuccessPopup
				open={openSuccess}
				handleClose={handleCloseSuccess}
				message={`Login successfully. Redirect in ${countdown} ${countdown === 1 ? "second" : "seconds"}.`}
			/>
			<Popup.ErrorPopup open={openError} handleClose={handleCloseError} statusCode={status} message={message} />
			<Box
				sx={{
					height: "100vh",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					backgroundImage: `url(${backgroundImage})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}>
				<Container
					component="main"
					maxWidth="xs"
					sx={{
						bgcolor: "white",
						borderRadius: 2,
						boxShadow:
							"0px 3px 5px -1px rgba(255, 255, 255, 0.4), 0px 6px 10px 0px rgba(255, 255, 255, 0.28), 0px 1px 18px 0px rgba(255, 255, 255, 0.24)",
					}}>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}>
						<img src={logo} alt="Logo" width="150px" />
						<Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
							<TextField
								required
								fullWidth
								label="Username"
								value={userName}
								autoFocus
								onChange={(e) => setUserName(e.target.value)}
								sx={{ mt: 3, mb: 2 }}
							/>
							<TextField
								required
								fullWidth
								label="Password"
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								sx={{ mt: 3, mb: 2 }}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												onClick={handleClickShowPassword}
												onMouseDown={handleMouseDownPassword}
												edge="end">
												{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
							<Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
								<Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, width: "100px" }}>
									Login
								</Button>
							</Box>
						</Box>
					</Box>
				</Container>
			</Box>
		</>
	);
};
export default Login;
