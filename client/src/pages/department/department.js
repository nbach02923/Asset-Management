import React from "react";
import { Container } from "@mui/material";
import DataTable from "../../components/dataTable";
import ModalComponent from "../../components/modal";
import Popup from "../../components/popup";
import useDepartmentState from "./useDepartmentState";

const Department = () => {
	const {
		data,
		tableHeader,
		handleAddNew,
		handleEdit,
		handleDelete,
		open,
		handleClose,
		handleAPI,
		title,
		fields,
		showError,
		showSuccess,
		showWarning,
		errorStatusCode,
		responseMessage,
		setShowError,
		setShowSuccess,
		setShowWarning,
		total,
		currentPage,
		setCurrentPage,
	} = useDepartmentState();
	return (
		<Container>
			<DataTable
				title="Department Table"
				headers={tableHeader}
				data={data}
				handleActionOnClick={{
					addNew: handleAddNew,
					edit: handleEdit,
					delete: handleDelete,
				}}
				total={total}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
			/>
			<ModalComponent open={open} handleClose={handleClose} title={title} fields={fields} handleAPI={handleAPI} />
			<Popup.WarningPopup
				open={showWarning}
				handleClose={() => setShowWarning(false)}
				handleOk={handleAPI}
				message="Are you sure to delete this department?"
			/>
			<Popup.ErrorPopup
				open={showError}
				handleClose={() => setShowError(false)}
				statusCode={errorStatusCode}
				message={responseMessage}
			/>
			<Popup.SuccessPopup
				open={showSuccess}
				handleClose={() => setShowSuccess(false)}
				message={"The department account was deleted successfully."}
			/>
		</Container>
	);
};
export default Department;
