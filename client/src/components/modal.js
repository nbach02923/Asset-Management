import { useState } from "react";
import { Modal, Box, Typography, Button, CircularProgress } from "@mui/material";

const ModalComponent = ({ open, handleClose, title, children }) => {
	const [loading, setLoading] = useState(false);

	const handleSave = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			handleClose();
		}, 4000);
	};

	return (
		<Modal open={open} onClose={handleClose}>
			<Box
				sx={{
					borderRadius: 2,
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					bgcolor: "white",
					boxShadow: 24,
					p: 4,
				}}>
				<Typography variant="h6">{title}</Typography>
				{children}
				<Button
					onClick={handleSave}
					variant="contained"
					color="success"
					disabled={loading}
					sx={{ width: "40px", marginRight: "2px" }}>
					{loading ? <CircularProgress size={24} /> : "Save"}
				</Button>
				<Button
					onClick={handleClose}
					variant="contained"
					color="error"
					disabled={loading}
					sx={{ width: "40px" }}>
					Close
				</Button>
			</Box>
		</Modal>
	);
};
export default ModalComponent;
