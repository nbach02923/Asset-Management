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
	TableHead,
	Pagination,
	TableRow,
	TextField,
	Typography,
	IconButton,
	PaginationItem,
	FormGroup,
	FormControlLabel,
	Checkbox,
} from "@mui/material";
import {
	AddCircleOutline as AddCircleOutlineIcon,
	Delete as DeleteIcon,
	Edit as EditIcon,
	Search as SearchIcon,
	ContentPasteSearch as ContentPasteSearchIcon,
	Flag as FlagIcon,
	Download as DownloadIcon,
} from "@mui/icons-material";
import { Zoom } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import userPermission from "../utils/userPermission";

const EditButton = userPermission(IconButton, [true, false]);
const DeleteButton = userPermission(IconButton, [true]);
const DataTable = ({
	title,
	headers,
	data,
	handleActionOnClick,
	columnWidths,
	actionsColumnWidth,
	shouldRenderEditButton = () => true,
	rowsPerPage = 15,
	total,
	currentPage,
	setCurrentPage,
	shouldRenderActionsColumn = true,
	shouldRenderSearchBar = true,
	filterCheckBox = [],
	selectedValue,
	setSelectedValue,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredData, setFilteredData] = useState(data);
	const [page] = useState(0);
	const [originalData, setOriginalData] = useState(data || []);
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
				<Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
					{shouldRenderSearchBar && (
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
					)}
					<FormGroup row>
						{filterCheckBox.map((item, index) => (
							<FormControlLabel
								control={
									<Checkbox
										checked={selectedValue === item}
										onChange={() => setSelectedValue(item)}
									/>
								}
								label={item}
								key={index}
								sx={{ ml: 2 }}
							/>
						))}
					</FormGroup>
				</Box>
				{handleActionOnClick && handleActionOnClick.addNew && (
					<Button
						variant="contained"
						onClick={handleActionOnClick.addNew}
						startIcon={<AddCircleOutlineIcon />}
						sx={{ marginBottom: "5px" }}>
						Add New
					</Button>
				)}
				{handleActionOnClick && handleActionOnClick.download && (
					<Button
						variant="contained"
						onClick={handleActionOnClick.download}
						startIcon={<DownloadIcon />}
						sx={{ marginBottom: "5px" }}>
						Download
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
							{handleActionOnClick && shouldRenderActionsColumn && (
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
												(_value, index) =>
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
													{value.length > 40 ? value.substring(0, 40) + "..." : value}
												</TableCell>
											))}
										{handleActionOnClick && shouldRenderActionsColumn && (
											<TableCell style={{ width: actionsColumnWidth, textAlign: "center" }}>
												{handleActionOnClick.edit &&
													(!shouldRenderEditButton || shouldRenderEditButton(row)) && (
														<Tooltip title="Edit" TransitionComponent={Zoom}>
															<EditButton
																onClick={() => handleActionOnClick.edit(row)}
																sx={{
																	"&:hover": {
																		color: "#3f51b5",
																	},
																}}>
																<EditIcon />
															</EditButton>
														</Tooltip>
													)}
												{handleActionOnClick.view && (
													<Tooltip title="View" TransitionComponent={Zoom}>
														<IconButton
															onClick={() => handleActionOnClick.view(row)}
															sx={{
																"&:hover": {
																	color: "#2196f3",
																},
															}}>
															<ContentPasteSearchIcon />
														</IconButton>
													</Tooltip>
												)}
												{handleActionOnClick.delete && (
													<Tooltip title="Delete" TransitionComponent={Zoom}>
														<DeleteButton
															onClick={() => handleActionOnClick.delete(row)}
															sx={{
																"&:hover": {
																	color: "#f44336",
																},
															}}>
															<DeleteIcon />
														</DeleteButton>
													</Tooltip>
												)}
												{handleActionOnClick.report && (
													<Tooltip title="Report" TransitionComponent={Zoom}>
														<IconButton
															onClick={() => handleActionOnClick.report(row)}
															sx={{
																"&:hover": {
																	color: "#f44336",
																},
															}}>
															<FlagIcon />
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
				</Table>
			</TableContainer>
			<Pagination
				sx={{ mt: 1 }}
				variant="outlined"
				shape="rounded"
				color="primary"
				count={Math.ceil(total / 15)}
				page={currentPage + 1}
				onChange={(event, value) => setCurrentPage(value - 1)}
				renderItem={(item) => (
					<PaginationItem
						{...item}
						disabled={
							(item.page === 0 && item.type === "previous") || (total <= 15 && item.type === "next")
						}
					/>
				)}
			/>
		</>
	);
};
export default DataTable;
