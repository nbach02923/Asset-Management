import { Container } from "@mui/material";
import React from "react";
import ModalComponent from "../../components/modal";
import DataTable from "../../components/dataTable";
import useCategoryState from "./useCategoryState";

const Category = () => {
	const { data, tableHeader, handleAddNew, handleEdit, handleDelete } = useCategoryState();
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
		</Container>
	);
};
export default Category;
