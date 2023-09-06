import React, { useState, useMemo } from "react";
import { Box, TextField, Typography, Grid, InputLabel, Stack, Button, InputAdornment, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import API from "../../services/request";
import Popup from "../../components/popup";
import decodeJWT from "../../utils/decodeJWT";

const fields = ["Current Password", "New Password", "Confirm Password"];
const decoded = decodeJWT();
const ChangePassword = () => {
	const headers = useMemo(() => {
		return {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
			Accept: "application/json",
		};
	}, []);
	const [showPassword, setShowPassword] = useState(Array(fields.length).fill(false));
	const [values, setValues] = useState(Array(fields.length).fill(""));
	const [showError, setShowError] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [showWarning, setShowWarning] = useState(false);
	const [responseMessage, setResponseMessage] = useState("");
	const [statusCode, setStatusCode] = useState(null);
	const handleClickShowPassword = (index) => {
		setShowPassword((prevShowPassword) => prevShowPassword.map((show, i) => (i === index ? !show : show)));
	};
	const handleMouseDownPassword = (e) => {
		e.preventDefault();
	};
	const handleClear = () => {
		setValues(Array(fields.length).fill(""));
	};
	const handleSave = () => {
		setShowWarning(true);
	};
	const handleAPI = () => {
		setShowWarning(false);
		const payload = {
			password: values[0],
			newPassword: values[1],
			confPassword: values[2],
		};
		API.patchAPI(`/user/changePassword/${decoded.id}`, headers, payload)
			.then((response) => {
				setResponseMessage(response.data.message);
				setShowSuccess(true);
				setValues(Array(fields.length).fill(""));
			})
			.catch((err) => {
				setShowError(true);
				setStatusCode(err.response.status);
				if (err.response.data.details) {
					setResponseMessage(err.response.data.details.body[0].message);
				} else {
					setResponseMessage(err.response.data.message);
				}
			});
	};
	return (
		<>
			<Stack
				direction="column"
				sx={{
					borderRadius: 3,
					border: "1px solid #7d7d7d",
					mt: 2,
				}}>
				<Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
					<Typography variant="h3">Change Password</Typography>
				</Box>
				<form style={{ width: "55%", margin: "auto" }}>
					{fields.map((field, index) => (
						<Grid container spacing={2} sx={{ mb: 1 }} key={index}>
							<Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
								<InputLabel>{field}:</InputLabel>
							</Grid>
							<Grid item xs={9}>
								<TextField
									size="small"
									fullWidth
									type={showPassword[index] ? "text" : "password"}
									value={values[index]}
									onChange={(event) =>
										setValues((prevValues) =>
											prevValues.map((value, i) => (i === index ? event.target.value : value))
										)
									}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													edge="end"
													onClick={() => handleClickShowPassword(index)}
													onMouseDown={handleMouseDownPassword}>
													{showPassword[index] ? <VisibilityOffIcon /> : <VisibilityIcon />}
												</IconButton>
											</InputAdornment>
										),
									}}></TextField>
							</Grid>
						</Grid>
					))}
				</form>
				<Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
					<Button variant="contained" color="success" sx={{ mr: 1 }} onClick={handleSave}>
						Save
					</Button>
					<Button variant="contained" color="error" onClick={handleClear}>
						Clear
					</Button>
				</Box>
			</Stack>
			<Popup.WarningPopup
				open={showWarning}
				handleClose={() => setShowWarning(false)}
				handleOk={handleAPI}
				message="Are you sure to delete this user account?"
			/>
			<Popup.ErrorPopup
				open={showError}
				handleClose={() => setShowError(false)}
				statusCode={statusCode}
				message={responseMessage}
			/>
			<Popup.SuccessPopup
				open={showSuccess}
				handleClose={() => setShowSuccess(false)}
				message={responseMessage}
			/>
		</>
	);
};
export default ChangePassword;
