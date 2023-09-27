import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { VictoryPie, VictoryTooltip, VictoryLabel, VictoryContainer } from "victory";
import useDashBoardState from "./useDashBoardState";
import DataTable from "../../components/dataTable";

const DashBoard = () => {
	const { assetData, assetTotal, data, customHeaders, total, currentPage, setCurrentPage } = useDashBoardState();
	return (
		<Container>
			<Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
				<Box sx={{ width: "700px" }}>
					<DataTable
						title="Recent Activity"
						headers={customHeaders}
						data={data}
						shouldRenderSearchBar={false}
						total={total}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
					/>
				</Box>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						width: "400px",
						height: "432px",
						border: "1px solid black",
						borderRadius: "5px",
					}}>
					<Box sx={{ width: "100%" }}>
						<Typography variant="h6">&nbsp;&nbsp;Asset count by status</Typography>
					</Box>
					<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
						<VictoryContainer width={400} height={400}>
							<VictoryPie
								standalone={false}
								data={assetData}
								innerRadius={80}
								labelComponent={<VictoryTooltip style={{ fontSize: 20 }} />}
								padAngle={1}
								style={{
									data: {
										fill: ({ datum }) => datum.color,
									},
								}}
							/>
							<VictoryLabel
								textAnchor="middle"
								style={{ fontSize: 30 }}
								x={200}
								y={200}
								text={`Asset: ${assetTotal}`}
							/>
						</VictoryContainer>
					</Box>
				</Box>
			</Box>
		</Container>
	);
};
export default DashBoard;
