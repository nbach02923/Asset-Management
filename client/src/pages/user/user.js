import React from "react";
import { Container } from "@mui/material";
import DataTable from "../../components/dataTable";

const User = () => {
	return (
		<Container>
			<DataTable title="User Table" headers={[]} data={[]} />
		</Container>
	);
};
export default User;
