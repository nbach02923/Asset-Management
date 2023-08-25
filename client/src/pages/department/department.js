import React from "react";
import { Container } from "@mui/material";
import DataTable from "../../components/dataTable";
import { useDepartmentState } from "./useDepartmentState";

const Department = () => {
	const { data, tableHeaders } = useDepartmentState();
	return (
		<Container>
			<DataTable title="Department Table" headers={tableHeaders} data={data} />
		</Container>
	);
};
export default Department;
