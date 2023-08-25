import React from "react";
import { Container } from "@mui/material";
import DataTable from "../../components/dataTable";
import usePositionState from "./usePositionState";

const Position = () => {
	const { data, tableHeaders } = usePositionState();
	return (
		<Container>
			<DataTable title="Position Table" headers={tableHeaders} data={data} />
		</Container>
	);
};
export default Position;
