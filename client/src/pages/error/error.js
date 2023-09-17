import React from "react";
import { Container } from "@mui/material";
import DataTable from "../../components/dataTable";
import useErrorState from "./useErrorState";
import ModalComponent from "../../components/modal";

const Error = () => {
	const {
		data,
		tableHeader,
		handleEdit,
		open,
		handleClose,
		title,
		fields,
		handleAPI,
		shouldRenderEditButton,
		total,
		currentPage,
		setCurrentPage,
	} = useErrorState();
	return (
		<Container>
			<DataTable
				title="Error Report Table"
				headers={tableHeader}
				data={data}
				handleActionOnClick={{
					edit: handleEdit,
				}}
				columnWidths={[150, 80, 130]}
				shouldRenderEditButton={shouldRenderEditButton}
				total={total}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
			/>
			<ModalComponent open={open} handleClose={handleClose} title={title} fields={fields} handleAPI={handleAPI} />
		</Container>
	);
};
export default Error;
