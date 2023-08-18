import { useState, useEffect, useMemo } from "react";
import API from "../../services/request";

export default function useAssetState() {
	const [data, setData] = useState([]);
	const [tableHeader, setTableHeader] = useState([]);
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [fields, setFields] = useState([]);
	const [category, setCategory] = useState([]);
	const [selectedName, setSelectedName] = useState("");
	const [selectedType, setSelectedType] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedStatus, setSelectedStatus] = useState("");
	const [selectedDescription, setSelectedDescription] = useState("");
	const [selectedCategoryId, setSelectedCategoryId] = useState(null);
	const [currentAction, setCurrentAction] = useState(null);
	const [selectedId, setSelectedId] = useState(null);
	const [showWarning, setShowWarning] = useState(false);
	const [assetToDelete, setAssetToDelete] = useState(null);
	const [showSuccess, setShowSuccess] = useState(false);
	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [errorStatusCode, setErrorStatusCode] = useState(null);
	const headers = useMemo(() => {
		return {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
			Accept: "application/json",
		};
	}, []);
	useEffect(() => {
		const querys = {
			limit: 1000,
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
				const customData = assetData.map((item) => {
					return {
						id: item.id,
						name: item.name,
						picture: "",
						serial: item.serial,
						type: item.type,
						category: categoryMap[item.categoryAssetId],
						status: item.status,
					};
				});
				setData(customData);
			}
		);
	}, [headers]);
	useEffect(() => {
		if (!open) {
			setSelectedName("");
			setSelectedType("");
			setSelectedCategory("");
			setSelectedStatus("");
			setSelectedDescription("");
		} else {
			setFields((prevFields) =>
				prevFields.map((field) => {
					if (field.label === "Asset Name") {
						return { ...field, value: selectedName };
					} else if (field.label === "Type") {
						return { ...field, value: selectedType };
					} else if (field.label === "Category") {
						return { ...field, value: selectedCategory };
					} else if (field.label === "Status") {
						return { ...field, value: selectedStatus };
					} else if (field.label === "Description") {
						return { ...field, value: selectedDescription };
					} else {
						return field;
					}
				})
			);
		}
	}, [open, selectedName, selectedType, selectedCategory, selectedStatus, selectedDescription]);
	const handleAddNew = () => {
		setFields([
			createField("Asset Name", "text", selectedName, setSelectedName),
			createSelectField("Type", ["Stationary", "Nonstationary", "Other"], selectedType, setSelectedType),
			createSelectField(
				"Category",
				category.map((item) => item.name),
				selectedCategory,
				setSelectedCategory,
				category,
				setSelectedCategoryId
			),
			createSelectField("Status", ["Ready to Deploy", "Deployed", "Error"], selectedStatus, setSelectedStatus),
			createField("Decription", "textarea", selectedDescription, setSelectedDescription),
		]);
		setOpen(true);
		setTitle("Add New Asset");
		setCurrentAction("addNew");
	};
	const handleEdit = (row) => {
		setSelectedId(row.id);
		setSelectedName(row.name);
		setSelectedType(row.type);
		setSelectedCategory(row.category);
		setSelectedDescription(row.description);
		setFields([
			createField("Asset Name", "text", row.name, setSelectedName),
			createSelectField("Type", ["Stationary", "Nonstationary", "Other"], row.type, setSelectedType),
			createSelectField(
				"Category",
				category.map((item) => item.name),
				row.category,
				setSelectedCategory,
				category,
				setSelectedCategoryId
			),
			createField("Decription", "textarea", row.description, setSelectedDescription),
		]);
		setOpen(true);
		setTitle("Edit Asset");
		setCurrentAction("edit");
	};
	const handleView = (row) => {
		setCurrentAction("view");
		setSelectedId(row.id);
		setSelectedName(row.name);
		setSelectedType(row.type);
		setSelectedCategory(row.category);
		setSelectedStatus(row.status);
		setSelectedDescription(row.description);
		setFields([
			createField("Asset Name", "text", row.name, setSelectedName, true),
			createSelectField(
				"Type",
				["Stationary", "Nonstationary", "Other"],
				row.type,
				setSelectedType,
				null,
				null,
				true
			),
			createSelectField(
				"Category",
				category.map((item) => item.name),
				row.category,
				setSelectedCategory,
				category,
				setSelectedCategoryId,
				true
			),
			createSelectField(
				"Status",
				["Ready to Deploy", "Deployed", "Error"],
				row.status,
				setSelectedStatus,
				null,
				null,
				true
			),
			createField("Decription", "textarea", row.description, setSelectedDescription, true),
		]);
		setOpen(true);
		setTitle("View Asset");
	};
	const handleDelete = (row) => {
		setAssetToDelete(row);
		setShowWarning(true);
	};
	const handleDeleteConfirm = () => {
		API.deleteAPI(`/asset/${assetToDelete.id}`, headers)
			.then(() => {
				setData((prevData) => prevData.filter((item) => item.id !== assetToDelete.id));
				setShowWarning(false);
				setAssetToDelete(null);
				setShowSuccess(true);
			})
			.catch((err) => {
				console.error(err);
				setShowWarning(false);
				setAssetToDelete(null);
				setErrorStatusCode(err.response.status);
				setErrorMessage(err.message);
				setShowError(true);
			});
	};
	const handleClose = () => {
		setOpen(false);
	};
	const handleAPI = () => {
		return new Promise((resolve, reject) => {
			if (currentAction === "addNew") {
				const payload = {
					name: selectedName,
					type: selectedType,
					status: selectedStatus,
					categoryId: selectedCategoryId,
					description: selectedDescription,
				};
				API.postAPI("/asset", headers, payload)
					.then((response) => {
						resolve(response.data);
					})
					.catch((err) => {
						reject(err);
					});
			} else if (currentAction === "edit") {
				console.log("Save Edit");
				const payload = {
					name: selectedName,
					type: selectedType,
					categoryId: selectedCategoryId,
					description: selectedDescription,
				};
				API.patchAPI(`/asset/${selectedId}`, headers, payload)
					.then((response) => {
						resolve(response.data);
					})
					.catch((err) => {
						reject(err);
					});
			} else if (currentAction === "delete") {
				console.log("Save Delete");
				resolve();
			}
		});
	};
	return {
		data,
		tableHeader,
		open,
		title,
		fields,
		handleAddNew,
		handleEdit,
		handleView,
		handleDelete,
		handleClose,
		handleAPI,
		showWarning,
		setShowWarning,
		handleDeleteConfirm,
		showError,
		setShowError,
		errorStatusCode,
		errorMessage,
		showSuccess,
		setShowSuccess,
		currentAction,
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
