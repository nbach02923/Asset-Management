import React, { useState, useEffect } from "react";
import API from "../services/request";
import DataTable from "../components/dataTable";

const Asset = () => {
	const [data, setData] = useState([]);
	useEffect(() => {
		const headers = {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("token")}`,
			Accept: "application/json",
		};
		API.getAPI("/asset", headers)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				setData(data);
			});
	}, []);
	const tableHeaders = data.length > 0 ? Object.keys(data[0]) : [];
	return <DataTable title="Assets" headers={tableHeaders} data={data} />;
};
export default Asset;
