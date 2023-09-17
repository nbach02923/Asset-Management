import { useEffect, useState, useMemo } from "react";
import API from "../../services/request";

const useStatisticsState = () => {
	const [data, setData] = useState([]);
	const [tableHeader, setTableHeader] = useState([]);
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
		API.getAPI("/asset/statistics", headers, { offset: 15 * currentPage }).then((response) => {
			const data = response.data;
			setTotal(data.assetTotal);
			const customHeaders = ["Asset Name", "Time Requested", "Time Reported"];
			setTableHeader(customHeaders);
			const customData = data.assetStatistics.map((item) => {
				return {
					id: item.id,
					name: item.name,
					timeRequested: item.timeRequested,
					timeReported: item.timeReported,
				};
			});
			setData(customData);
		});
	}, [headers, currentPage]);
	return {
		data,
		tableHeader,
		total,
		currentPage,
		setCurrentPage,
	};
};
export default useStatisticsState;
