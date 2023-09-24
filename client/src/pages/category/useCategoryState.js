import { useState, useEffect } from "react";
import API from "../../services/request";
import createAllField from "../../utils/field";

const useCategoryState = () => {
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
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);
	const handleClose = () => {
		setOpen(false);
	};
	const handleAddNew = () => {
		setFields([createAllField.createField("Name", "text", selectedName, setSelectedName)]);
		setOpen(true);
		setTitle("Add New Category");
		setCurrentAction("addNew");
	};
	const handleEdit = (row) => {
		setSelectedId(row.id);
		setSelectedName(row.name);
		setFields([createAllField.createField("Name", "text", row.name, setSelectedName)]);
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
				API.postAPI("/categoryAsset", undefined, payload)
					.then((response) => {
						resolve(response);
						setUpdateData((prev) => !prev);
					})
					.catch((err) => {
						reject(err);
					});
			} else if (currentAction === "edit") {
				const payload = {
					name: selectedName,
				};
				API.patchAPI(`/categoryAsset/${selectedId}`, payload)
					.then((response) => {
						resolve(response);
						setUpdateData((prev) => !prev);
					})
					.catch((err) => {
						reject(err);
					});
			} else if (currentAction === "delete") {
				setShowWarning(false);
				API.deleteAPI(`/categoryAsset/${selectedId}`)
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
			offset: 15 * currentPage,
		};
		API.getAPI("/categoryAsset", querys).then((response) => {
			const category = response.data;
			const customHeaders = ["Category Name", "Asset Quantity"];
			setTableHeader(customHeaders);
			setTotal(category.categoryTotal);
			const customData = category.category.map((item) => {
				return {
					id: item.id,
					name: item.name,
					quantiry: item.assetCount,
				};
			});
			setData(customData);
		});
	}, [updateData, currentPage]);
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
		total,
		currentPage,
		setCurrentPage,
	};
};
export default useCategoryState;
