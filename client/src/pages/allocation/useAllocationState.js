import { useState, useEffect, useMemo } from "react";
import API from "../../services/request";
import createAllField from "../../utils/field";

const useAllocationState = () => {
	const [data, setData] = useState([]);
	const [tableHeader, setTableHeader] = useState([]);
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [fields, setFields] = useState([]);
	const [selectedId, setSelectedId] = useState("");
	const [currentAction, setCurrentAction] = useState(null);
	const [, setSelectedAsset] = useState("");
	const [, setSelectedUser] = useState("");
	const [, setSelectedAllocationDate] = useState("");
	const [, setSelectedReturnDate] = useState("");
	const [selectedAllocationStatus, setSelectedAllocationStatus] = useState("");
	const [updateData, setUpdateData] = useState(false);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);
	const headers = useMemo(() => {
		return {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
			Accept: "application/json",
		};
	}, []);
	useEffect(() => {
		Promise.all([
			API.getAPI("/asset/allocation", headers, { offset: 15 * currentPage }),
			API.getAPI("/asset", headers, { limit: 1000 }),
			API.getAPI("/user", headers, { limit: 1000 }),
		]).then(([allocationResponse, assetResponse, userResponse]) => {
			const allocationData = allocationResponse.data;
			const assetData = assetResponse.data;
			const assetMap = {};
			assetData.asset.forEach((asset) => {
				assetMap[asset.id] = asset.name;
			});
			const userData = userResponse.data;
			const userMap = {};
			userData.user.forEach((user) => {
				userMap[user.id] = user.userName;
			});
			setTotal(allocationData.allocationTotal);
			const customData = allocationData.allocation.map((item) => {
				const allocationDate = new Date(item.allocationDate);
				const returnDate = new Date(item.returnDate);
				const formattedAllocationDate = allocationDate.toLocaleString("vi-vn");
				const formattedReturnDate = returnDate.toLocaleString("vi-vn");
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
	}, [headers, updateData, currentPage]);
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
		const verifyOptionsMap = {
			Pending: ["Allocated", "Rejected"],
			Allocated: ["Return Request"],
			"Waiting to Approve": ["Returned"],
		};
		const verifyOptions = verifyOptionsMap[row.allocationStatus] || [];
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
				const urlMap = {
					Returned: `/asset/verifyReturn/${selectedId}`,
					"Return Request": `/asset/returnAsset/${selectedId}`,
					Allocated: `/asset/verifyAsset/${selectedId}`,
					Rejected: `/asset/verifyAsset/${selectedId}`,
				};
				const url = urlMap[selectedAllocationStatus];
				const payload =
					selectedAllocationStatus === "Return Request"
						? { allocationStatus: "Waiting to Approve" }
						: { allocationStatus: selectedAllocationStatus };
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
		return !["Rejected", "Returned"].includes(row.allocationStatus);
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
		total,
		currentPage,
		setCurrentPage,
	};
};
export default useAllocationState;
