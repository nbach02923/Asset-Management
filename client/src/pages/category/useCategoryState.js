import { useState, useEffect, useMemo } from "react";
import API from "../../services/request";

export default function useCategoryState() {
	const [data, setData] = useState([]);
	const [tableHeader, setTableHeader] = useState([]);
	const headers = useMemo(() => {
		return {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
			Accept: "application/json",
		};
	}, []);
	const handleAddNew = () => {
		console.log("Add new clicked")
	};
	const handleEdit = () => {
		console.log("Edit clicked")
	};
	const handleDelete = () => {
		console.log("Delete clicked")
	};
	useEffect(() => {
		const querys = {
			limit: 1000,
		};
		API.getAPI("/categoryAsset", headers, querys).then((response) => {
			const category = response.data;
			console.log(category);
			const customHeaders = ["Category Name", "Asset Quantity"];
			setTableHeader(customHeaders);
			const customData = category.map((item) => {
				return {
					id: item.id,
					name: item.name,
					quantiry: item.assetCount,
				};
			});
			setData(customData);
			console.log(customData);
		});
	}, [headers]);
	return {
		data,
		tableHeader,
		handleAddNew,
		handleEdit,
		handleDelete,
	};
}
function createField(label, type, value, onChange, disabled = false) {
	return {
		label,
		type,
		value,
		onChange: (event) => onChange(event.target.value),
		disabled,
	};
}
function createSelectField(
	label,
	options,
	value,
	onChange,
	category = null,
	setSelectedCategoryId = null,
	disabled = false
) {
	return {
		label,
		type: "select",
		options,
		value,
		onChange: (event) => {
			onChange(event.target.value);
			if (category && setSelectedCategoryId) {
				const selectedCategoryName = event.target.value;
				const selectedCategory = category.find((item) => item.name === selectedCategoryName);
				setSelectedCategoryId(selectedCategory.id);
			}
		},
		disabled,
	};
}
