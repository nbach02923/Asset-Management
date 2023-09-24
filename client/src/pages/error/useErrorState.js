import { useEffect, useState } from "react";
import API from "../../services/request";
import createAllField from "../../utils/field";

const useErrorState = () => {
	const [data, setData] = useState([]);
	const [tableHeader, setTableHeader] = useState([]);
	const [open, setOpen] = useState(false);
	const [fields, setFields] = useState([]);
	const [title, setTitle] = useState("");
	const [, setSelectedDescription] = useState("");
	const [, setSelectedAssetName] = useState("");
	const [currentAction, setCurrentAction] = useState("");
	const [selectedVerify, setSelectedVerify] = useState("");
	const [selectedId, setSelectedId] = useState("");
	const [updateData, setUpdateData] = useState(false);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);
	useEffect(() => {
		Promise.all([
			API.getAPI("/asset/error", { offset: 15 * currentPage }),
			API.getAPI("/asset", { limit: 1000 }),
			API.getAPI("/user", { limit: 1000 }),
		]).then(([errorResponse, assetResponse, userResponse]) => {
			const errorData = errorResponse.data;
			const assetData = assetResponse.data;
			const assetMap = {};
			assetData.asset.forEach((asset) => (assetMap[asset.id] = asset.name));
			const userData = userResponse.data;
			const userMap = {};
			userData.user.forEach((user) => (userMap[user.id] = user.userName));
			const customHeaders = ["Asset Name", "User Report", "Report Status", "Error Description", "Report Time"];
			setTableHeader(customHeaders);
			setTotal(errorData.errorTotal);
			const customData = errorData.errorData.map((item) => {
				const reportDate = new Date(item.createAt);
				const formatedReportDate = reportDate.toLocaleString("vi-vn");
				return {
					id: item.id,
					asset: assetMap[item.assetId],
					user: userMap[item.userId],
					status: item.status,
					errorDescription: item.description,
					reportDate: formatedReportDate,
				};
			});
			setData(customData);
		});
	}, [updateData, currentPage]);
	const handleClose = () => {
		setOpen(false);
	};
	const handleEdit = (row) => {
		setOpen(true);
		setSelectedId(row.id);
		setTitle("Verify Error");
		const commonFields = [
			createAllField.createField("Asset Name", "text", row.asset, setSelectedAssetName, true),
			createAllField.createField(
				"Error Description",
				"textarea",
				row.errorDescription,
				setSelectedDescription,
				true
			),
		];
		const verifyOptionsMap = {
			"Waiting to Approve": ["Approved", "Disapproved"],
			Approved: ["Fixed"],
		};
		const verifyOptions = verifyOptionsMap[row.status] || [];
		const verifyField = createAllField.createRadioField(
			"Verify",
			verifyOptions,
			selectedVerify,
			setSelectedVerify,
			"row"
		);
		setFields([...commonFields, verifyField]);
		setCurrentAction("edit");
	};
	const handleAPI = () => {
		return new Promise((resolve, reject) => {
			if (currentAction === "edit") {
				const urlMap = {
					Fixed: `/asset/fixAsset/${selectedId}`,
					Approved: `/asset/verifyReport/${selectedId}`,
					Disapproved: `/asset/verifyReport/${selectedId}`,
				};
				const url = urlMap[selectedVerify];
				const payload = { status: selectedVerify };
				API.patchAPI(url, payload)
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
		return !["Fixed", "Disapproved"].includes(row.status);
	};
	return {
		data,
		tableHeader,
		open,
		handleAPI,
		handleClose,
		handleEdit,
		title,
		fields,
		shouldRenderEditButton,
		total,
		currentPage,
		setCurrentPage,
	};
};
export default useErrorState;
