import { useState, useEffect, useMemo } from "react";
import API from "../../services/request";
import createAllField from "../../utils/field";

export default function usePositionState() {
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
		setFields([createAllField.createField("Name", "text", selectedName, setSelectedName)]);
		setOpen(true);
		setTitle("Add New Position");
		setCurrentAction("addNew");
	};
	const handleEdit = (row) => {
		setSelectedId(row.code);
		setSelectedName(row.name);
		setFields([createAllField.createField("Name", "text", row.name, setSelectedName)]);
		setOpen(true);
		setTitle("Edit Position");
		setCurrentAction("edit");
	};
	const handleDelete = (row) => {
		setCurrentAction("delete");
		setSelectedId(row.code);
		setShowWarning(true);
	};
	const handleAPI = () => {
		return new Promise((resolve, reject) => {
			if (currentAction === "addNew") {
				const payload = {
					name: selectedName,
				};
				API.postAPI("/position", headers, payload)
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
				API.patchAPI(`/position/${selectedId}`, headers, payload)
					.then((response) => {
						resolve(response.data);
						setUpdateData((prev) => !prev);
					})
					.catch((err) => {
						reject(err);
						console.log(err);
					});
			} else if (currentAction === "delete") {
				setShowWarning(false);
				API.deleteAPI(`/position/${selectedId}`, headers)
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
		API.getAPI("/position", headers, querys).then((response) => {
			const position = response.data;
			const customHeaders = ["Position Name"];
			setTableHeader(customHeaders);
			const customData = position.map((item) => {
				return {
					code: item.code,
					name: item.name,
				};
			});
			setData(customData);
		});
	}, [headers, updateData]);
	return {
		data,
		tableHeader,
		open,
		title,
		fields,
		handleAPI,
		handleDelete,
		handleEdit,
		handleAddNew,
		currentAction,
		showError,
		setShowError,
		showSuccess,
		setShowSuccess,
		showWarning,
		setShowWarning,
		responseMessage,
		setResponseMessage,
		errorStatusCode,
		setErrorStatusCode,
		handleClose,
	};
}
