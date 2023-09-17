import React from "react";
import DataTable from "../../components/dataTable";
import { Container } from "@mui/material";
import useStatisticsState from "./useStatisticsState";

const Statistics = () => {
	const { data, tableHeader, total, currentPage, setCurrentPage } = useStatisticsState();
	return (
		<Container>
			<DataTable
				title="Asset Statistics Table"
				headers={tableHeader}
				data={data}
				total={total}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
			/>
		</Container>
	);
};
export default Statistics;
