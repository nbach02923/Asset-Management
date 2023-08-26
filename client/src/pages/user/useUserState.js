import { useState, useEffect, useMemo } from "react";
import API from "../../services/request";

export default function useUserState() {
	const [data, setData] = useState([]);
	const [tableHeader, setTableHeader] = useState([]);
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [fields, setFields] = useState([]);
	const [department, setDepartment] = useState([]);
	const [position, setPosition] = useState([]);
	const [currentAction, setCurrentAction] = useState(null);
	const [selectedId, setSelectedId] = useState(null);
	const [showWarning, setShowWarning] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [showError, setShowError] = useState(false);
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
	useEffect(() => {
		const querys = {
			limit: 1000,
		};
		Promise.all([
			API.getAPI("/user", headers, querys),
			API.getAPI("/department", headers, querys),
			API.getAPI("/position", headers, querys),
		]).then(([assetResponse, departmentResponse, positionResponse]) => {
			const assetData = assetResponse.data;
			const departmentData = departmentResponse.data;
			const positionData = positionResponse.data;
			setDepartment(departmentData);
			setPosition(positionData);
			const departmentMap = {};
			departmentData.forEach((department) => {
				departmentMap[department.id] = department.name;
			});
			const positionMap = {};
			positionData.forEach((position) => {
				positionMap[position.code] = position.name;
			});
			const customHeaders = ["User Name", "Department", "Role", "Position"];
			setTableHeader(customHeaders);
			const customData = assetData.map((item) => {
				return {
					id: item.id,
					userName: item.userName,
					department: departmentMap[item.departmentId],
					role: item.role ? "Admin" : "User",
					position: positionMap[item.positionCode],
				};
			});
			setData(customData);
		});
	}, [headers, updateData]);
	const handleAddNew = () => {};
	const handleEdit = (row) => {};
	const handleView = (row) => {};
	const handleDelete = (row) => {};
	const handleClose = () => {
		setOpen(false);
	};
	const handleAPI = () => {
		return new Promise((resolve, reject) => {
			if (currentAction === "addNew") {
			} else if (currentAction === "edit") {
			} else if (currentAction === "delete") {
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
		showError,
		setShowError,
		errorStatusCode,
		responseMessage,
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
