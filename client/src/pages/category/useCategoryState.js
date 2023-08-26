import { useState, useEffect, useMemo } from "react";
import API from "../../services/request";

export default function useCategoryState() {
	const [data, setData] = useState([]);
	const [tableHeader, setTableHeader] = useState([]);
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [currentAction, setCurrentAction] = useState(null);
	const [fields, setFields] = useState([]);
	const [selectedName, setSelectedName] = useState("");
	const [selectedId, setSelectedId] = useState(null);
	const [showError, setShowError] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [showWarning, setShowWarning] = useState(false);
	const [responseMessage, setResponseMessage] = useState("");
	const [errorStatusCode, setErrorStatusCode] = useState(null);
	const [updateData, setUpdateData] = useState(false);
	const headers = useMemo(() => {
		return {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
			Accept: "application/json",
		};
	}, []);
	const handleClose = () => {
		setOpen(false);
	};
	const handleAddNew = () => {
		setFields([createField("Name", "text", selectedName, setSelectedName)]);
		setOpen(true);
		setTitle("Add New Category");
		setCurrentAction("addNew");
	};
	const handleEdit = (row) => {
		setSelectedId(row.id);
		setSelectedName(row.name);
		setFields([createField("Name", "text", row.name, setSelectedName)]);
		setOpen(true);
		setTitle("Edit Category");
		setCurrentAction("edit");
	};
	const handleDelete = (row) => {
		setCurrentAction("delete");
		setSelectedId(row.id);
		setShowWarning(true);
	};
	const handleAPI = () => {
		return new Promise((resolve, reject) => {
			if (currentAction === "addNew") {
				const payload = {
					name: selectedName,
				};
				API.postAPI("/categoryAsset", headers, payload)
					.then((response) => {
						resolve(response.data);
						setUpdateData((prev) => !prev);
					})
					.catch((err) => {
						reject(err);
					});
			} else if (currentAction === "edit") {
				const payload = {
					name: selectedName,
				};
				API.patchAPI(`/categoryAsset/${selectedId}`, headers, payload)
					.then((response) => {
						resolve(response.data);
						setUpdateData((prev) => !prev);
					})
					.catch((err) => {
						reject(err);
					});
			} else if (currentAction === "delete") {
				setShowWarning(false);
				API.deleteAPI(`/categoryAsset/${selectedId}`, headers)
					.then((response) => {
						resolve(response.data);
						setUpdateData((prev) => !prev);
						setShowSuccess(true);
						setResponseMessage("Delete successfully");
					})
					.catch((err) => {
						reject(err);
						setShowError(true);
						setErrorStatusCode(err.response.status);
						if (err.response.data.details) {
							setResponseMessage(err.response.data.details.body[0].message);
						} else {
							setResponseMessage(err.response.data.message);
						}
					});
			}
		});
	};
	useEffect(() => {
		if (!open) {
			setSelectedName("");
		} else {
			setFields((prevFields) =>
				prevFields.map((field) => {
					return { ...field, value: selectedName };
				})
			);
		}
	}, [open, selectedName]);
	useEffect(() => {
		const querys = {
			limit: 1000,
		};
		API.getAPI("/categoryAsset", headers, querys).then((response) => {
			const category = response.data;
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
		});
	}, [headers, updateData]);
	return {
		data,
		tableHeader,
		open,
		handleAddNew,
		handleEdit,
		handleDelete,
		handleClose,
		handleAPI,
		title,
		fields,
		currentAction,
		showError,
		setShowError,
		showSuccess,
		setShowSuccess,
		showWarning,
		setShowWarning,
		errorStatusCode,
		responseMessage,
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
