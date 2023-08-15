import React, { useState, useEffect } from "react";
import API from "../services/request";
import DataTable from "../components/dataTable";
import { Container } from "@mui/material";

const Asset = () => {
	const [data, setData] = useState([]);
	const [tableHeader, setTableHeader] = useState([]);
	const handleAddNew = () => {
		console.log("Add is clicked");
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
	useEffect(() => {
		const headers = {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
			Accept: "application/json",
		};
		Promise.all([API.getAPI("/asset", headers), API.getAPI("/categoryAsset", headers)]).then(
			([assetResponse, categoryResponse]) => {
				const assetData = assetResponse.data;
				const categoryData = categoryResponse.data;
				const categoryMap = {};
				categoryData.forEach((category) => {
					categoryMap[category.id] = category.name;
				});
				const customHeaders = ["No.", "Asset Name", "Asset Picture", "Serial", "Category", "Status"];
				setTableHeader(customHeaders);
				const customData = assetData.map((item, index) => ({
					"No.": index + 1,
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
	const columnWidths = [30, 200, 100, 80, 120, 150];
	const actionsColumnWidth = 120;
	const filterableColumns = ["Category", "Status"]
	const sortableColumns = ["Asset Name", "Serial", "Category", "Status"]
	return (
		<Container>
			<DataTable
				title="Assets"
				headers={tableHeader}
				data={data}
				handleActionOnClick={{
					addNew: handleAddNew,
					edit: handleEdit,
					view: handleView,
					delete: handleDelete,
				}}
				filterableColumns={filterableColumns}
				sortableColumns={sortableColumns}
				columnWidths={columnWidths}
				actionsColumnWidth={actionsColumnWidth}
			/>
		</Container>
	);
};
export default Asset;
