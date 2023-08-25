import { useState, useEffect, useMemo } from "react";
export function useDepartmentState() {
	const [data, setData] = useState([]);
	const [tableHeaders, setTableHeaders] = useState([]);
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
		API.getAPI("/department", headers, querys).then((response) => {
			const department = response.data;
			const customHeaders = ["Department Name"];
			setTableHeaders(customHeaders);
			const customData = department.map((item) => {
				return {
					id: item.id,
					name: item.name,
				};
			});
			setData(customData);
		});
	}, [headers]);
	return { data, tableHeaders };
}
