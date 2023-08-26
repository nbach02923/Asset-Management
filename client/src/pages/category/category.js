import { Container } from "@mui/material";
import React from "react";
import ModalComponent from "../../components/modal";
import DataTable from "../../components/dataTable";
import useCategoryState from "./useCategoryState";
import Popup from "../../components/popup";

const Category = () => {
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
	} = useCategoryState();
	return (
		<Container>
			<DataTable
				title="Category Table"
				headers={tableHeader}
				data={data}
				handleActionOnClick={{
					addNew: handleAddNew,
					edit: handleEdit,
					delete: handleDelete,
				}}
			/>
			<ModalComponent open={open} handleClose={handleClose} title={title} fields={fields} handleAPI={handleAPI} />
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
				message={responseMessage}
			/>
			<Popup.SuccessPopup
				open={showSuccess}
				handleClose={() => setShowSuccess(false)}
				message={"The asset was deleted successfully."}
			/>
		</Container>
	);
};
export default Category;
