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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Zoom from "@mui/material/Zoom";

const DataTable = ({
	title,
	headers,
	data,
	handleActionOnClick,
	filterableColumns = [],
	sortableColumns = [],
	columnWidths,
	actionsColumnWidth,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredData, setFilteredData] = useState(data);
	const [columnFilters, setColumnFilters] = useState({});
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedColumn, setSelectedColumn] = useState(null);
	const [sortColumn, setSortColumn] = useState(null);
	const [sortOrder, setSortOrder] = useState("asc");
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
	const handleSort = (columnName) => {
		if (sortColumn === columnName) {
			setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
		} else {
			setSortColumn(columnName);
			setSortOrder("asc");
		}
	};
	useEffect(() => {
		let filteredData = data;
		if (sortColumn) {
			filteredData = [...filteredData].sort((a, b) => {
				if (a[sortColumn] < b[sortColumn]) {
					return sortOrder === "asc" ? -1 : 1;
				} else if (a[sortColumn] > b[sortColumn]) {
					return sortOrder === "asc" ? 1 : -1;
				} else {
					return 0;
				}
			});
		}
		setFilteredData(filteredData);
	}, [data, columnFilters, sortColumn, sortOrder]);
	return (
		<>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<h2>{title}</h2>
				{handleActionOnClick && handleActionOnClick.addNew && (
					<Button
						variant="contained"
						onClick={handleActionOnClick.addNew}
						startIcon={<AddCircleOutlineIcon />}>
						Add New
					</Button>
				)}
			</Box>
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
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							{headers.map((header, index) => (
								<TableCell key={index} style={{ width: columnWidths && columnWidths[index] }}>
									{sortableColumns.includes(header) && (
										<IconButton onClick={() => handleSort(header)}>
											{sortColumn === header && sortOrder === "asc" ? (
												<ArrowUpwardIcon />
											) : (
												<ArrowDownwardIcon />
											)}
										</IconButton>
									)}
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
						{filteredData.map((row, index) => (
							<TableRow key={index}>
								{Object.values(row).map((value, index) => (
									<TableCell key={index} style={{ width: columnWidths && columnWidths[index] }}>
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
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};
export default DataTable;
