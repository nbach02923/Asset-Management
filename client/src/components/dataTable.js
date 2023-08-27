import React, { useState, useEffect } from "react";
import {
	Box,
	Button,
	InputAdornment,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableFooter,
	TableHead,
	TablePagination,
	TableRow,
	TextField,
	Typography,
	IconButton,
} from "@mui/material";
import {
	AddCircleOutline as AddCircleOutlineIcon,
	Delete as DeleteIcon,
	Edit as EditIcon,
	Search as SearchIcon,
	ContentPasteSearch as ContentPasteSearchIcon,
} from "@mui/icons-material";
import { Zoom } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

const DataTable = ({ title, headers, data, handleActionOnClick, columnWidths, actionsColumnWidth }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredData, setFilteredData] = useState(data);
	const [page, setPage] = useState(0);
	const [originalData, setOriginalData] = useState(data || []);
	const rowsPerPage = 15;

	useEffect(() => {
		setFilteredData(data);
	}, [data]);

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

	useEffect(() => {
		setOriginalData(data);
		setFilteredData(data);
	}, [data]);

	return (
		<>
			<Typography variant="h3" sx={{ marginBlock: "10px" }}>
				{title}
			</Typography>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					justifyItems: "center",
				}}>
				<TextField
					label="Search Item"
					value={searchTerm}
					onChange={handleSearch}
					sx={{ marginBottom: "5px", width: "300px" }}
					size="small"
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon />
							</InputAdornment>
						),
					}}
				/>
				{handleActionOnClick && handleActionOnClick.addNew && (
					<Button
						variant="contained"
						onClick={handleActionOnClick.addNew}
						startIcon={<AddCircleOutlineIcon />}
						sx={{ marginBottom: "5px" }}>
						Add New
					</Button>
				)}
			</Box>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>No.</TableCell>
							{headers.map((header, index) => (
								<TableCell key={index} style={{ width: columnWidths && columnWidths[index] }}>
									{header}
								</TableCell>
							))}
							{handleActionOnClick && (
								<TableCell style={{ width: actionsColumnWidth, textAlign: "center" }}>
									Actions
								</TableCell>
							)}
						</TableRow>
					</TableHead>
					<TableBody>
						{Array.isArray(filteredData) && filteredData.length > 0 ? (
							filteredData
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row, index) => (
									<TableRow key={index}>
										<TableCell>
											{originalData.findIndex((originalRow) => originalRow === row) + 1}
										</TableCell>
										{Object.values(row)
											.filter(
												(value, index) =>
													![
														"id",
														"code",
														"type",
														"description",
														"fullName",
														"phoneNumber",
														"email",
														"dob",
														"avatarPath",
													].includes(Object.keys(row)[index])
											)
											.map((value, index) => (
												<TableCell
													key={index}
													style={{ width: columnWidths && columnWidths[index] }}>
													{value}
												</TableCell>
											))}
										{handleActionOnClick && (
											<TableCell style={{ width: actionsColumnWidth, textAlign: "center" }}>
												{handleActionOnClick.edit && (
													<Tooltip title="Edit" TransitionComponent={Zoom}>
														<IconButton onClick={() => handleActionOnClick.edit(row)}>
															<EditIcon />
														</IconButton>
													</Tooltip>
												)}
												{handleActionOnClick.view && (
													<Tooltip title="View" TransitionComponent={Zoom}>
														<IconButton onClick={() => handleActionOnClick.view(row)}>
															<ContentPasteSearchIcon />
														</IconButton>
													</Tooltip>
												)}
												{handleActionOnClick.delete && (
													<Tooltip title="Delete" TransitionComponent={Zoom}>
														<IconButton onClick={() => handleActionOnClick.delete(row)}>
															<DeleteIcon />
														</IconButton>
													</Tooltip>
												)}
											</TableCell>
										)}
									</TableRow>
								))
						) : (
							<TableRow>
								<TableCell colSpan={headers.length + 2} align="center">
									No data to display
								</TableCell>
							</TableRow>
						)}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TablePagination
								rowsPerPageOptions={[]}
								page={page}
								rowsPerPage={rowsPerPage}
								count={filteredData.length}
								onPageChange={(event, newPage) => {
									setPage(newPage);
								}}
							/>
						</TableRow>
					</TableFooter>
				</Table>
			</TableContainer>
		</>
	);
};
export default DataTable;
