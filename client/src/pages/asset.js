import React, { useState, useEffect } from "react";
import API from "../services/request";
import DataTable from "../components/dataTable";
import { Container } from "@mui/material";
import ModalComponent from "../components/modal";
import Popup from "../components/popup";

const Asset = () => {
	const [data, setData] = useState([]);
	const [tableHeader, setTableHeader] = useState([]);
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [fields, setFields] = useState([]);
	const [category, setCategory] = useState([]);
	const [selectedType, setSelectedType] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedStatus, setSelectedStatus] = useState("");
	const [currentAction, setCurrentAction] = useState(null);
	const limit = 1000;
	const columnWidths = [200, 124];
	const actionsColumnWidth = 120;
	const filterableColumns = ["Category", "Status"];
	const handleAddNew = () => {
		console.log("Add is clicked");
		setFields([
			{
				label: "Asset Name",
				type: "text",
			},
			{
				label: "Type",
				type: "select",
				options: ["Stationary", "Non-Stationary", "Other"],
				value: selectedType,
				onChange: (event) => setSelectedType(event.target.value),
			},
			{
				label: "Category",
				type: "select",
				options: category.map((item) => item.name),
				value: selectedCategory,
				onChange: (event) => setSelectedCategory(event.target.value),
			},
			{
				label: "Status",
				type: "select",
				options: ["Ready to Deploy", "Deployed", "Error"],
				value: selectedStatus,
				onChange: (event) => setSelectedStatus(event.target.value),
			},
		]);
		setOpen(true);
		setTitle("Add New Asset");
		setCurrentAction("addNew");
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
	const handleAPI = () => {
		if (currentAction === "addNew") {
			console.log("Save Add New");
		} else if (currentAction === "edit") {
			console.log("Save Edit");
		} else if (currentAction === "delete") {
			console.log("Save Delete");
		}
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
				setCategory(categoryData);
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
	useEffect(() => {
		if (!open) {
			setSelectedType("");
			setSelectedCategory("");
			setSelectedStatus("");
		} else {
			setFields((prevFields) =>
				prevFields.map((field) => {
					if (field.label === "Type") {
						return { ...field, value: selectedType };
					} else if (field.label === "Category") {
						return { ...field, value: selectedCategory };
					} else if (field.label === "Status") {
						return { ...field, value: selectedStatus };
					} else {
						return field;
					}
				})
			);
		}
	}, [open, selectedType, selectedCategory, selectedStatus]);
	return (
		<Container>
			{/* <Popup.ErrorPopup open={open} handleClose={handleClose} />
			<Popup.SuccessPopup open={open} handleClose={handleClose} />
			<Popup.WarningPopup open={open} handleClose={handleClose} /> */}
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
			<ModalComponent open={open} handleClose={handleClose} title={title} fields={fields} handleAPI={handleAPI} />
		</Container>
	);
};
export default Asset;
