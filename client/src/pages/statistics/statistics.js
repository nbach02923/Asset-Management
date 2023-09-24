import React from "react";
import DataTable from "../../components/dataTable";
import { Container } from "@mui/material";
import useStatisticsState from "./useStatisticsState";

const Statistics = () => {
	const { data, tableHeader, total, currentPage, setCurrentPage, handleDownload } = useStatisticsState();
	return (
		<Container>
			<DataTable
				title="Asset Statistics Table"
				headers={tableHeader}
				data={data}
				total={total}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				handleActionOnClick={{
					download: handleDownload,
				}}
				shouldRenderActionsColumn={false}
			/>
		</Container>
	);
};
export default Statistics;
