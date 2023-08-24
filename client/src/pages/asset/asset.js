import React from "react";
import { Container } from "@mui/material";
import DataTable from "../../components/dataTable";
import ModalComponent from "../../components/modal";
import useAssetState from "./useAssetState";
import Popup from "../../components/popup";

const Asset = () => {
	const {
		data,
		tableHeader,
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
	} = useAssetState();

	return (
		<Container>
			<DataTable
				title="Assets Table"
				headers={tableHeader}
				data={data}
				handleActionOnClick={{
					addNew: handleAddNew,
					edit: handleEdit,
					view: handleView,
					delete: handleDelete,
				}}
				filterableColumns={["Category", "Status"]}
				columnWidths={[200, 124]}
				actionsColumnWidth={120}
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
		</Container>
	);
};
export default Asset;
