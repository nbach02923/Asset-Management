import React, { useState, useEffect, useMemo } from "react";
import ModalComponent from "../../components/modal";
import DataTable from "../../components/dataTable";
import { Container } from "@mui/material";
import decodeJWT from "../../utils/decodeJWT";

const MyTicket = () => {
	const decoded = decodeJWT();
	const headers = useMemo(() => {
		return {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
			Accept: "application/json",
		};
	}, []);
	const [open, setOpen] = useState(false);
	useEffect(() => {
		const query = {
			userId: `${decoded.id}`,
		};
	}, []);
	return (
		<Container>
			<DataTable title="Request Record Table" data={[]} headers={[]} />
		</Container>
	);
};
export default MyTicket;
