import React from "react";
import { Container } from "@mui/material";
import DataTable from "../../components/dataTable";
import usePositionState from "./usePositionState";

const Position = () => {
	const { data, tableHeader } = usePositionState();
	return (
		<Container>
			<DataTable title="Position Table" headers={tableHeader} data={data} />
		</Container>
	);
};
export default Position;
