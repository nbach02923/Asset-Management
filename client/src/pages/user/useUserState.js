import { useState, useEffect } from "react";
import API from "../../services/request";
import createAllField from "../../utils/field";

const useUserState = () => {
	const [data, setData] = useState([]);
	const [tableHeader, setTableHeader] = useState([]);
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [fields, setFields] = useState([]);
	const [department, setDepartment] = useState([]);
	const [position, setPosition] = useState([]);
	const [currentAction, setCurrentAction] = useState(null);
	const [selectedId, setSelectedId] = useState(null);
	const [selectedUserName, setSelectedUserName] = useState("");
	const [selectedDepartment, setSelectedDepartment] = useState("");
	const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
	const [selectedPosition, setSelectedPosition] = useState("");
	const [selectedPositionCode, setSelectedPositionCode] = useState(null);
	const [selectedRole, setSelectedRole] = useState("");
	const [selectedFullName, setSelectedFullName] = useState("");
	const [selectedEmail, setSelectedEmail] = useState("");
	const [selectedPhone, setSelectedPhone] = useState("");
	const [selectedDoB, setSelectedDoB] = useState("");
	const [showWarning, setShowWarning] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [showError, setShowError] = useState(false);
	const [responseMessage, setResponseMessage] = useState("");
	const [errorStatusCode, setErrorStatusCode] = useState(null);
	const [updateData, setUpdateData] = useState(false);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);
	useEffect(() => {
		if (!open) {
			setSelectedUserName("");
			setSelectedDepartment("");
			setSelectedRole("");
			setSelectedPosition("");
			setSelectedPhone("");
			setSelectedFullName("");
			setSelectedEmail("");
			setSelectedDoB("");
		} else {
			setFields((prevFields) =>
				prevFields.map((field) => {
					if (field.label === "User Name") {
						return { ...field, value: selectedUserName };
					} else if (field.label === "Department") {
						return { ...field, value: selectedDepartment };
					} else if (field.label === "Role") {
						return { ...field, value: selectedRole };
					} else if (field.label === "Position") {
						return { ...field, value: selectedPosition };
					} else if (field.label === "Full Name") {
						return { ...field, value: selectedFullName };
					} else if (field.label === "Phone Number") {
						return { ...field, value: selectedPhone };
					} else if (field.label === "Email") {
						return { ...field, value: selectedEmail };
					} else if (field.label === "Date of Birth") {
						return { ...field, value: selectedDoB };
					} else {
						return field;
					}
				})
			);
		}
	}, [
		open,
		selectedUserName,
		selectedFullName,
		selectedRole,
		selectedDepartment,
		selectedPosition,
		selectedDoB,
		selectedEmail,
		selectedPhone,
	]);
	useEffect(() => {
		const querys = {
			offset: 15 * currentPage,
		};
		Promise.all([
			API.getAPI("/user", querys),
			API.getAPI("/department", { limit: 100 }),
			API.getAPI("/position", { limit: 100 }),
		]).then(([userResponse, departmentResponse, positionResponse]) => {
			const userData = userResponse.data;
			const departmentData = departmentResponse.data;
			const positionData = positionResponse.data;
			setDepartment(departmentData.department);
			setPosition(positionData.position);
			const departmentMap = {};
			departmentData.department.forEach((department) => {
				departmentMap[department.id] = department.name;
			});
			const positionMap = {};
			positionData.position.forEach((position) => {
				positionMap[position.code] = position.name;
			});
			const customHeaders = ["User Name", "Department", "Role", "Position"];
			setTableHeader(customHeaders);
			const customData = userData.user.map((item) => {
				const userInformation = item.userInformation || {};
				return {
					id: item.id,
					userName: item.userName,
					department: departmentMap[item.departmentId],
					role: item.role ? "Admin" : "User",
					position: positionMap[item.positionCode],
					fullName: userInformation.fullName || "",
					email: userInformation.email || "",
					dob: userInformation.dateOfBirth || "",
					phoneNumber: userInformation.phoneNumber || "",
					avatarPath: userInformation.avatarPath || "",
				};
			});
			setTotal(userData.userTotal);
			setData(customData);
		});
	}, [updateData, currentPage]);
	const handleAddNew = () => {
		setCurrentAction("addNew");
		setOpen(true);
		setTitle("Add New User");
		setFields([
			createAllField.createField("User Name", "text", selectedUserName, setSelectedUserName),
			createAllField.createSelectField(
				"Department",
				department.map((item) => item.name),
				selectedDepartment,
				setSelectedDepartment,
				department,
				setSelectedDepartmentId
			),
			createAllField.createSelectField(
				"Position",
				position.map((item) => item.name),
				selectedPosition,
				setSelectedPosition,
				position,
				setSelectedPositionCode,
				"code"
			),
			createAllField.createRadioField("Role", ["Admin", "User"], selectedRole, setSelectedRole, "row"),
		]);
	};
	const handleEdit = (row) => {
		setCurrentAction("edit");
		setOpen(true);
		setTitle("Edit User");
		const selectedDepartment = department.find((item) => item.name === row.department);
		setSelectedDepartmentId(selectedDepartment.id);
		const selectedPosition = position.find((item) => item.name === row.position);
		setSelectedPositionCode(selectedPosition.code);
		setSelectedId(row.id);
		setSelectedFullName(row.fullName);
		setSelectedDepartment(row.department);
		setSelectedPosition(row.position);
		setSelectedPhone(row.phoneNumber);
		setSelectedEmail(row.email);
		setSelectedDoB(row.dob);
		setFields([
			createAllField.createField("Full Name", "text", row.fullName, setSelectedFullName),
			createAllField.createField("Email", "text", row.email, setSelectedEmail),
			createAllField.createField("Phone Number", "text", row.phoneNumber, setSelectedPhone),
			createAllField.createField("Date of Birth", "text", row.dob, setSelectedDoB),
			createAllField.createSelectField(
				"Department",
				department.map((item) => item.name),
				row.department,
				setSelectedDepartment,
				department,
				setSelectedDepartmentId
			),
			createAllField.createSelectField(
				"Position",
				position.map((item) => item.name),
				row.position,
				setSelectedPosition,
				position,
				setSelectedPositionCode,
				"code"
			),
		]);
	};
	const handleView = (row) => {
		setCurrentAction("view");
		setFields([
			createAllField.createField("User Name", "text", row.userName, setSelectedUserName, true),
			createAllField.createField("Department", "text", row.department, setSelectedDepartment, true),
			createAllField.createField("Position", "text", row.position, setSelectedPosition, true),
			createAllField.createField("Full Name", "text", row.fullName, setSelectedFullName, true),
			createAllField.createField("Email", "text", row.email, setSelectedEmail, true),
			createAllField.createField("Phone Number", "text", row.phoneNumber, setSelectedPhone, true),
			createAllField.createField("Date of Birth", "text", row.dob, setSelectedDoB, true),
		]);
		setOpen(true);
		setTitle("View User Details");
	};
	const handleDelete = (row) => {
		setSelectedId(row.id);
		setCurrentAction("delete");
		setShowWarning(true);
	};
	const handleClose = () => {
		setOpen(false);
	};
	const handleAPI = () => {
		return new Promise((resolve, reject) => {
			if (currentAction === "addNew") {
				const payload = {
					userName: selectedUserName,
					departmentId: selectedDepartmentId,
					positionCode: selectedPositionCode,
					role: selectedRole === "Admin" ? true : false,
				};
				API.postAPI("/user", undefined, payload)
					.then((response) => {
						resolve(response);
						setUpdateData((prev) => !prev);
					})
					.catch((err) => {
						reject(err);
					});
			} else if (currentAction === "edit") {
				const payload = {
					fullName: selectedFullName,
					phoneNumber: selectedPhone,
					email: selectedEmail,
					dateOfBirth: selectedDoB,
					departmentId: selectedDepartmentId,
					positionCode: selectedPositionCode,
				};
				API.patchAPI(`/user/${selectedId}`, payload)
					.then((response) => {
						resolve(response);
						setUpdateData((prev) => !prev);
					})
					.catch((err) => {
						reject(err);
					});
			} else if (currentAction === "delete") {
				setShowWarning(false);
				API.deleteAPI(`/user/${selectedId}`)
					.then((response) => {
						resolve(response.data);
						setUpdateData((prev) => !prev);
						setShowSuccess(true);
						setResponseMessage("Delete Succesfully");
					})
					.catch((err) => {
						setShowError(true);
						setErrorStatusCode(err.response.status);
						if (err.response.data.details) {
							setResponseMessage(err.response.data.details.body[0].message);
						} else {
							setResponseMessage(err.response.data.message);
						}
						reject(err);
					});
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
		total,
		currentPage,
		setCurrentPage,
	};
};
export default useUserState;
