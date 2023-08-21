import React from "react";
import { Container } from "@mui/material";
import DataTable from "../../components/dataTable";

const Department = () => {
	return (
		<Container>
			<DataTable title="Department Table" headers={[]} data={[]} />
		</Container>
	);
};
export default Department;