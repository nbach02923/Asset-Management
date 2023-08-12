import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from "@mui/material";

const DataTable = ({ title, headers, data }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredData, setFilteredData] = useState(data);
	const handleSearch = (event) => {
		setSearchTerm(event.target.value);
		if (event.target.value === "") {
			setFilteredData(data);
		} else {
			setFilteredData(
				data.filter((row) =>
					Object.values(row).some((value) =>
						value.toString().toLowerCase().includes(event.target.value.toLowerCase())
					)
				)
			);
		}
	};
	return (
		<>
			<h2>{title}</h2>
			<TextField label="Search Item" value={searchTerm} onChange={handleSearch} />
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							{headers.map((header) => (
								<TableCell key={header}>{header}</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredData.map((row, index) => (
							<TableRow key={index}>
								{Object.values(row).map((value, index) => (
									<TableCell key={index}>{value}</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};
export default DataTable