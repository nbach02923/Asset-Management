import React from "react";
import { Box, Container, Modal, IconButton, Card, Stack, Typography, Button } from "@mui/material";
import DataTable from "../../components/dataTable";
import ModalComponent from "../../components/modal";
import useAssetState from "./useAssetState";
import Popup from "../../components/popup";
import CloseIcon from "@mui/icons-material/Close";
import UploadIcon from "@mui/icons-material/Upload";

const Asset = () => {
	const {
		data,
		customHeaders,
		open,
		title,
		fields,
		handleAddNew,
		handleEdit,
		handleView,
		handleDelete,
		handleClose,
		handleAPI,
		showWarning,
		setShowWarning,
		showSuccess,
		setShowSuccess,
		showError,
		setShowError,
		errorStatusCode,
		errorMessage,
		currentAction,
		shouldRenderEditButton,
		total,
		currentPage,
		setCurrentPage,
		openUpload,
		handleUploadClose,
		selectedFile,
		handleFileChange,
	} = useAssetState();
	return (
		<Container>
			<DataTable
				title="Assets Table"
				headers={customHeaders}
				data={data}
				handleActionOnClick={{
					addNew: handleAddNew,
					edit: handleEdit,
					view: handleView,
					delete: handleDelete,
				}}
				columnWidths={[200, 124]}
				actionsColumnWidth={120}
				shouldRenderEditButton={shouldRenderEditButton}
				total={total}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
			/>
			<ModalComponent
				open={open}
				handleClose={handleClose}
				title={title}
				fields={fields}
				handleAPI={handleAPI}
				isViewMode={currentAction === "view"}
			/>
			<Popup.WarningPopup
				open={showWarning}
				handleClose={() => setShowWarning(false)}
				handleOk={handleAPI}
				message="Are you sure to delete this asset?"
			/>
			<Popup.ErrorPopup
				open={showError}
				handleClose={() => setShowError(false)}
				statusCode={errorStatusCode}
				message={errorMessage}
			/>
			<Popup.SuccessPopup
				open={showSuccess}
				handleClose={() => setShowSuccess(false)}
				message={"The asset was deleted successfully."}
			/>
			<Modal
				open={openUpload}
				onClose={handleUploadClose}
				sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
				<Box
					sx={{
						borderRadius: 2,
						bgcolor: "white",
						boxShadow: 24,
						width: "400px",
						paddingX: 4,
						paddingBottom: 2,
						height: "270px",
						display: "flex",
						justifyContent: "center",
						flexDirection: "column",
					}}>
					<Box sx={{ display: "flex", justifyContent: "end" }}>
						<IconButton onClick={handleUploadClose}>
							<CloseIcon />
						</IconButton>
					</Box>
					<Card
						elevation={0}
						sx={{
							borderRadius: 2,
							borderStyle: "dashed",
							borderWidth: "1px",
							width: "400px",
							height: "200px",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}>
						{!selectedFile && (
							<Stack
								direction="column"
								sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
								<UploadIcon sx={{ fontSize: 48 }} />
								<Typography variant="h5">Upload picture to preview here</Typography>
							</Stack>
						)}
						{selectedFile && (
							<img
								src={URL.createObjectURL(selectedFile)}
								alt={selectedFile.name}
								style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
							/>
						)}
					</Card>
					<Box sx={{ mt: 1, display: "flex", justifyContent: "end" }}>
						{selectedFile && (
							<Button variant="contained" onClick={handleAPI} size="small" color="success" sx={{ mr: 1 }}>
								Upload
							</Button>
						)}
						<input
							accept="image/*"
							style={{ display: "none" }}
							id="raised-button-file"
							type="file"
							onChange={handleFileChange}
						/>
						<label htmlFor="raised-button-file">
							<Button size="small" variant="contained" component="span">
								Choose File
							</Button>
						</label>
					</Box>
				</Box>
			</Modal>
		</Container>
	);
};
export default Asset;
