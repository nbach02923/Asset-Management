import React, { useState, useEffect, useMemo } from "react";
import ModalComponent from "../../components/modal";
import DataTable from "../../components/dataTable";
import { Container } from "@mui/material";
import decodeJWT from "../../utils/decodeJWT";
import API from "../../services/request";
import createAllField from "../../utils/field";

const MyTicket = () => {
	const decoded = decodeJWT();
	const headers = useMemo(() => {
		return {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
			Accept: "application/json",
		};
	}, []);
	const [data, setData] = useState([]);
	const [tableHeader, setTableHeader] = useState([]);
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [fields, setFields] = useState([]);
	const [selectedId, setSelectedId] = useState("");
	const [currentAction, setCurrentAction] = useState(null);
	const [, setSelectedAsset] = useState("");
	const [, setSelectedAllocationDate] = useState("");
	const [, setSelectedReturnDate] = useState("");
	const [selectedAllocationStatus, setSelectedAllocationStatus] = useState("");
	const [selectedDescription, setSelectedDescription] = useState("");
	const [updateData, setUpdateData] = useState(false);
	const [asset, setAsset] = useState([]);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);
	useEffect(() => {
		const query = {
			userId: `${decoded.id}`,
			offset: 15 * currentPage,
		};
		Promise.all([
			API.getAPI("/asset/allocation", headers, query),
			API.getAPI("/asset", headers, { limit: 1000 }),
			API.getAPI("/user", headers, { limit: 1000 }),
		]).then(([allocationResponse, assetResponse, userResponse]) => {
			const allocationData = allocationResponse.data;
			const assetData = assetResponse.data;
			const assetMap = {};
			assetData.asset.forEach((asset) => {
				assetMap[asset.id] = asset.name;
			});
			setAsset(assetMap);
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
					allocationStatus: item.allocationStatus,
					allocationDate: formattedAllocationDate,
					returnDate: formattedReturnDate,
				};
			});
			setData(customData);
			const customHeader = ["Asset Name", "Request Status", "Allocation Date", "Return Date"];
			setTableHeader(customHeader);
		});
	}, [headers, updateData, decoded.id, currentPage]);
	const handleClose = () => {
		setOpen(false);
	};
	const handleEdit = (row) => {
		setSelectedId(row.id);
		setTitle("Return Asset Request");
		setSelectedAllocationDate(row.allocationStatus);
		setFields([
			createAllField.createField("Asset Name", "text", row.asset, setSelectedAsset, true),
			createAllField.createField("Allocation Date", "text", row.allocationDate, setSelectedAllocationDate, true),
			createAllField.createField("Return Date", "text", row.returnDate, setSelectedReturnDate, true),
			createAllField.createRadioField(
				"Verify",
				["Request to Return"],
				selectedAllocationStatus,
				setSelectedAllocationStatus,
				"row"
			),
		]);
		setOpen(true);
		setCurrentAction("edit");
	};
	const handleReport = (row) => {
		const assetId = Object.keys(asset).find((key) => asset[key] === row.asset);
		setSelectedId(assetId);
		setOpen(true);
		setTitle("Error Report");
		setFields([
			createAllField.createField("Asset Name", "text", row.asset, setSelectedAsset, true),
			createAllField.createField("Description", "textarea", row.description, setSelectedDescription),
		]);
		setCurrentAction("report");
	};
	const handleAPI = () => {
		return new Promise((resolve, reject) => {
			let payload;
			if (currentAction === "edit") {
				payload = {
					allocationStatus: selectedAllocationStatus === "" ? null : "Waiting to Approve",
				};
				console.log(payload);
				API.patchAPI(`/asset/returnAsset/${selectedId}`, headers, payload)
					.then((response) => {
						resolve(response);
						setUpdateData((prev) => !prev);
					})
					.catch((err) => {
						reject(err);
					});
			} else if (currentAction === "report") {
				payload = {
					userId: decoded.id,
					description: selectedDescription,
				};
				API.postAPI(`/asset/errorReport/${selectedId}`, headers, payload)
					.then((response) => {
						resolve(response);
						setUpdateData((prev) => !prev);
						console.log(response);
					})
					.catch((err) => {
						reject(err);
					});
			}
		});
	};
	const shouldRenderEditButton = (row) => {
		return !["Rejected", "Returned", "Waiting to Approve"].includes(row.allocationStatus);
	};
	return (
		<Container>
			<DataTable
				title="Request Record Table"
				data={data}
				headers={tableHeader}
				handleActionOnClick={{ edit: handleEdit, report: handleReport }}
				shouldRenderEditButton={shouldRenderEditButton}
				total={total}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
			/>
			<ModalComponent open={open} handleClose={handleClose} title={title} fields={fields} handleAPI={handleAPI} />
		</Container>
	);
};
export default MyTicket;
