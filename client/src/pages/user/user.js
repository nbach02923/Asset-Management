import React from "react";
import { Container } from "@mui/material";
import DataTable from "../../components/dataTable";
import useUserState from "./useUserState";
import ModalComponent from "../../components/modal";
import Popup from "../../components/popup";

const User = () => {
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
	} = useUserState();

	return (
		<Container>
			<DataTable
				title="User Table"
				headers={tableHeader}
				data={data}
				handleActionOnClick={{
					addNew: handleAddNew,
					edit: handleEdit,
					view: handleView,
					delete: handleDelete,
				}}
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
				message="Are you sure to delete this user account?"
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
				message={"The user account was deleted successfully."}
			/>
		</Container>
	);
};
export default User;
