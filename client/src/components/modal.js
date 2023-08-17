import React, { useState } from "react";
import { Modal, Box, Typography, Button, CircularProgress, Stack } from "@mui/material";
import Form from "./form";

const ModalComponent = ({ open, handleClose, title, fields = [], handleAPI }) => {
	const [loading, setLoading] = useState(false);

	const handleSave = () => {
		setLoading(true);
		handleAPI();
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
					width: "300px",
				}}>
				<Typography variant="h6">{title}</Typography>
				<Stack direction="column" spacing={1}>
					<Form fields={fields} />
				</Stack>
				<Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ marginTop: "8px" }}>
					<Button
						onClick={handleSave}
						variant="contained"
						color="success"
						disabled={loading}
						sx={{ width: "40px" }}>
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
				</Stack>
			</Box>
		</Modal>
	);
};
export default ModalComponent;
