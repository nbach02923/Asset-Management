import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, Box, IconButton, Grow } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from '@mui/icons-material/Warning';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Grow ref={ref} {...props} />;
});
const ErrorPopup = ({ open, handleClose, statusCode, message }) => {
	return (
		<Dialog
			open={open}
			onClose={handleClose}
			PaperProps={{ sx: { bgcolor: "#f63e50", borderRadius: 2 } }}
			TransitionComponent={Transition}>
			<DialogTitle sx={{ textAlign: "center" }}>
				<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", color: "white" }}>
					<ErrorIcon />
					Oh Snap!
				</Box>
				<IconButton onClick={handleClose} sx={{ position: "absolute", top: 8, right: 8, color: "white" }}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<DialogContentText sx={{ color: "white" }}>
					{statusCode}: {message}
				</DialogContentText>
			</DialogContent>
		</Dialog>
	);
};
const SuccessPopup = ({ open, handleClose, message }) => {
	return (
		<Dialog
			open={open}
			onClose={handleClose}
			PaperProps={{ sx: { bgcolor: "#0c7040", borderRadius: 2 } }}
			TransitionComponent={Transition}>
			<DialogTitle sx={{ textAlign: "center" }}>
				<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", color: "white" }}>
					<CheckCircleIcon />
					Well done!
				</Box>
				<IconButton onClick={handleClose} sx={{ position: "absolute", top: 8, right: 8, color: "white" }}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<DialogContentText sx={{ color: "white" }}>{message}</DialogContentText>
			</DialogContent>
		</Dialog>
	);
};
const WarningPopup = ({ open, handleClose, message }) => {
	return (
		<Dialog
			open={open}
			onClose={handleClose}
			PaperProps={{ sx: { bgcolor: "#fc8621", borderRadius: 2 } }}
			TransitionComponent={Transition}>
			<DialogTitle sx={{ textAlign: "center" }}>
				<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", color: "white" }}>
					<WarningIcon />
					Warning!
				</Box>
				<IconButton onClick={handleClose} sx={{ position: "absolute", top: 8, right: 8, color: "white" }}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<DialogContentText sx={{ color: "white" }}>{message}</DialogContentText>
			</DialogContent>
		</Dialog>
	);
};
const Popup = { ErrorPopup, SuccessPopup, WarningPopup };
export default Popup;
