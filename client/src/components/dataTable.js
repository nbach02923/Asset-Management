import React, { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TextField,
	IconButton,
	InputAdornment,
	Menu,
	MenuItem,
	Box,
	Button,
	Tooltip,
	TablePagination,
	Zoom,
	Typography,
	TableFooter,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const DataTable = ({
	title,
	headers,
	data,
	handleActionOnClick,
	filterableColumns = [],
	columnWidths,
	actionsColumnWidth,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredData, setFilteredData] = useState(data);
	const [columnFilters, setColumnFilters] = useState({});
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedColumn, setSelectedColumn] = useState(null);
	const [page, setPage] = useState(0);
	const [originalData, setOriginalData] = useState(data || []);
	const rowsPerPage = 15;
	const handleFilterIconClick = (event, columnName) => {
		setAnchorEl(event.currentTarget);
		setSelectedColumn(columnName);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
		setSelectedColumn(null);
	};
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
	const handleColumnFilterChange = (filterValue, columnName) => {
		setColumnFilters((prevFilters) => ({
			...prevFilters,
			[columnName]: filterValue,
		}));
	};
	useEffect(() => {
		let filteredData = data;
		Object.entries(columnFilters).forEach(([columnName, filterValue]) => {
			if (filterValue !== "") {
				filteredData = filteredData.filter((row) => row[columnName] === filterValue);
			}
		});
		setFilteredData(filteredData);
	}, [data, columnFilters]);
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
				sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", justifyItems: "center" }}>
				<TextField
					label="Search Item"
					value={searchTerm}
					onChange={handleSearch}
					sx={{ marginBottom: "5px" }}
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
									{filterableColumns.includes(header) && (
										<>
											<IconButton onClick={(event) => handleFilterIconClick(event, header)}>
												<FilterAltIcon />
											</IconButton>
											<Menu
												anchorEl={anchorEl}
												open={selectedColumn === header}
												onClose={handleMenuClose}>
												<MenuItem onClick={() => handleColumnFilterChange("", header)}>
													None
												</MenuItem>
												{[...new Set(data.map((row) => row[header]))].map((value) => (
													<MenuItem
														key={value}
														onClick={() => {
															handleColumnFilterChange(value, header);
															handleMenuClose();
														}}>
														{value}
													</MenuItem>
												))}
											</Menu>
										</>
									)}
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
													Object.keys(row)[index] !== "id" &&
													Object.keys(row)[index] !== "type"
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
