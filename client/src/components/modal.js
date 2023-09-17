import React, { useState } from "react";
import { Modal, Box, Typography, Button, CircularProgress, Stack } from "@mui/material";
import Form from "./form";
import Popup from "./popup";

const ModalComponent = ({ open, handleClose, title, fields = [], handleAPI, isViewMode }) => {
	const [loading, setLoading] = useState(false);
	const [successOpen, setSuccessOpen] = useState(false);
	const [errorOpen, setErrorOpen] = useState(false);
	const [warningOpen, setWarningOpen] = useState(false);
	const [statusCode, setStatusCode] = useState(null);
	const [responseMessage, setResponseMessage] = useState("");
	const handleSave = () => {
		setLoading(true);
		setWarningOpen(true);
	};
	const handleWarningClose = (result) => {
		setWarningOpen(false);
		if (result === "ok") {
			setLoading(true);
			handleAPI()
				.then((response) => {
					setSuccessOpen(true);
					setResponseMessage(response.data.message);
					setTimeout(() => {
						setLoading(false);
						handleClose();
					}, 1000);
				})
				.catch((err) => {
					setLoading(false);
					setStatusCode(err.response.status)
					if (err.response.data.details) {
						setResponseMessage(err.response.data.details.body[0].message);
					} else {
						setResponseMessage(err.response.data.message);
					}
					setErrorOpen(true);
				});
		} else {
			setLoading(false);
		}
	};
	return (
		<>
			<Modal
				open={open}
				onClose={handleClose}
				sx={{ overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}>
				<Box
					sx={{
						borderRadius: 2,
						bgcolor: "white",
						boxShadow: 24,
						p: 4,
						width: "350px",
						maxHeight: "calc(100vh - 64px)",
						overflow: "auto",
					}}>
					<Typography variant="h6">{title}</Typography>
					<Stack direction="column" spacing={1} x={{ overflow: "hidden" }}>
						<Form fields={fields} />
					</Stack>
					<Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ marginTop: "8px" }}>
						{!isViewMode && (
							<Button
								onClick={handleSave}
								variant="contained"
								color="success"
								disabled={loading}
								sx={{ width: "40px" }}>
								{loading ? <CircularProgress size={24} /> : "Save"}
							</Button>
						)}
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
			<Popup.WarningPopup
				open={warningOpen}
				handleClose={() => handleWarningClose("no")}
				handleOk={() => handleWarningClose("ok")}
				message="Are you sure?"
			/>
			<Popup.ErrorPopup
				open={errorOpen}
				handleClose={() => setErrorOpen(false)}
				statusCode={statusCode}
				message={responseMessage}
			/>
			<Popup.SuccessPopup
				open={successOpen}
				handleClose={() => setSuccessOpen(false)}
				message={responseMessage}
			/>
		</>
	);
};
export default ModalComponent;
