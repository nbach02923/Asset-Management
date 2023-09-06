import { useState, useEffect, useMemo } from "react";
import API from "../../services/request";
import createAllField from "../../utils/field";

export default function useAllocationState() {
	const [data, setData] = useState([]);
	const [tableHeader, setTableHeader] = useState([]);
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [fields, setFields] = useState([]);
	const [selectedId, setSelectedId] = useState("");
	const [currentAction, setCurrentAction] = useState(null);
	const [selectedAsset, setSelectedAsset] = useState("");
	const [selectedUser, setSelectedUser] = useState("");
	const [selectedAllocationDate, setSelectedAllocationDate] = useState("");
	const [selectedReturnDate, setSelectedReturnDate] = useState("");
	const [selectedAllocationStatus, setSelectedAllocationStatus] = useState("");
	const [updateData, setUpdateData] = useState(false);
	const headers = useMemo(() => {
		return {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
			Accept: "application/json",
		};
	}, []);
	useEffect(() => {
		Promise.all([
			API.getAPI("/asset/allocation", headers, { limit: 1000 }),
			API.getAPI("/asset", headers, { limit: 1000 }),
			API.getAPI("/user", headers, { limit: 1000 }),
		]).then(([allocationResponse, assetResponse, userResponse]) => {
			const allocationData = allocationResponse.data;
			const assetData = assetResponse.data;
			const assetMap = {};
			assetData.forEach((asset) => {
				assetMap[asset.id] = asset.name;
			});
			const userData = userResponse.data;
			const userMap = {};
			userData.forEach((user) => {
				userMap[user.id] = user.userName;
			});
			const customData = allocationData.map((item) => {
				const allocationDate = new Date(item.allocationDate);
				const returnDate = new Date(item.returnDate);
				const formattedAllocationDate = `${allocationDate.getUTCHours()}:${allocationDate.getUTCMinutes()}:${allocationDate.getUTCSeconds()} ${allocationDate.getUTCDate()}/${
					allocationDate.getUTCMonth() + 1
				}/${allocationDate.getUTCFullYear()}`;
				const formattedReturnDate = `${returnDate.getUTCHours()}:${returnDate.getUTCMinutes()}:${returnDate.getUTCSeconds()} ${returnDate.getUTCDate()}/${
					returnDate.getUTCMonth() + 1
				}/${returnDate.getUTCFullYear()}`;
				return {
					id: item.id,
					asset: assetMap[item.assetId],
					user: userMap[item.userId],
					allocationStatus: item.allocationStatus,
					allocationDate: formattedAllocationDate,
					returnDate: formattedReturnDate,
				};
			});
			setData(customData);
			const customHeader = ["Asset Name", "User Account", "Request Status", "Allocation Date", "Return Date"];
			setTableHeader(customHeader);
		});
	}, [headers, updateData]);
	const handleClose = () => {
		setOpen(false);
	};
	const handleEdit = (row) => {
		setSelectedId(row.id);
		setTitle("Request Verify");
		setSelectedAllocationDate(row.allocationStatus);
		const commonFields = [
			createAllField.createField("Asset Name", "text", row.asset, setSelectedAsset, true),
			createAllField.createField("User Name", "text", row.user, setSelectedUser, true),
			createAllField.createField("Allocation Date", "text", row.allocationDate, setSelectedAllocationDate, true),
			createAllField.createField("Return Date", "text", row.returnDate, setSelectedReturnDate, true),
		];
		const verifyOptions = row.allocationStatus === "Pending" ? ["Allocated", "Rejected"] : ["Returned"];
		const verifyField = createAllField.createRadioField(
			"Verify",
			verifyOptions,
			selectedAllocationStatus,
			setSelectedAllocationStatus,
			"row"
		);
		setFields([...commonFields, verifyField]);
		setOpen(true);
		setCurrentAction("edit");
	};
	const handleAPI = () => {
		return new Promise((resolve, reject) => {
			if (currentAction === "edit") {
				const url =
					selectedAllocationStatus === "Returned"
						? `/asset/verifyReturn/${selectedId}`
						: `/asset/verifyAsset/${selectedId}`;
				const payload =
					selectedAllocationStatus === "Returned" ? null : { allocationStatus: selectedAllocationStatus };
				API.patchAPI(url, headers, payload)
					.then((response) => {
						resolve(response);
						setUpdateData((prev) => !prev);
					})
					.catch((err) => {
						reject(err);
					});
			}
		});
	};
	const shouldRenderEditButton = (row) => {
		return !["Allocated", "Rejected", "Returned"].includes(row.allocationStatus);
	};
	return {
		data,
		tableHeader,
		handleEdit,
		open,
		handleClose,
		title,
		fields,
		currentAction,
		handleAPI,
		shouldRenderEditButton,
	};
}
