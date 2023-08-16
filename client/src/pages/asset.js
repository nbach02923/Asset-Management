import React, { useState, useEffect } from "react";
import API from "../services/request";
import DataTable from "../components/dataTable";
import { Container } from "@mui/material";
import ModalComponent from "../components/modal";

const Asset = () => {
	const [data, setData] = useState([]);
	const [tableHeader, setTableHeader] = useState([]);
	const limit = 1000;
	const [open, setOpen] = useState(false);
	const handleAddNew = () => {
		console.log("Add is clicked")
		setOpen(true);
	};
	const handleEdit = (row) => {
		//Edit function
		console.log("Edit is clicked");
	};
	const handleView = (row) => {
		//View function
		console.log("View is clicked");
	};
	const handleDelete = (row) => {
		//Delete function
		console.log("Delete is clicked");
	};
	const handleClose = () => {
		setOpen(false);
	};
	useEffect(() => {
		const headers = {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
			Accept: "application/json",
		};
		const querys = {
			limit: limit,
		};
		Promise.all([API.getAPI("/asset", headers, querys), API.getAPI("/categoryAsset", headers)]).then(
			([assetResponse, categoryResponse]) => {
				const assetData = assetResponse.data;
				const categoryData = categoryResponse.data;
				const categoryMap = {};
				categoryData.forEach((category) => {
					categoryMap[category.id] = category.name;
				});
				const customHeaders = ["Asset Name", "Asset Picture", "Serial", "Category", "Status"];
				setTableHeader(customHeaders);
				const customData = assetData.map((item) => ({
					"Asset Name": item.name,
					"Asset Picture": "",
					Serial: item.serial,
					Category: categoryMap[item.categoryAssetId],
					Status: item.status,
				}));
				setData(customData);
			}
		);
	}, []);
	const columnWidths = [200, 124];
	const actionsColumnWidth = 120;
	const filterableColumns = ["Category", "Status"];
	return (
		<Container>
			<DataTable
				title="Assets Table"
				headers={tableHeader}
				data={data}
				handleActionOnClick={{
					addNew: handleAddNew,
					edit: handleEdit,
					view: handleView,
					delete: handleDelete,
				}}
				filterableColumns={filterableColumns}
				columnWidths={columnWidths}
				actionsColumnWidth={actionsColumnWidth}
			/>
			<ModalComponent open={open} handleClose={handleClose} title={"Add New"} />
		</Container>
	);
};
export default Asset;
