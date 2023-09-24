import { useEffect, useState } from "react";
import API from "../../services/request";

const useStatisticsState = () => {
	const [data, setData] = useState([]);
	const [tableHeader, setTableHeader] = useState([]);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);
	useEffect(() => {
		API.getAPI("/asset/statistics", { offset: 15 * currentPage }).then((response) => {
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
	}, [currentPage]);
	const handleDownload = () => {
		API.getAPI("/asset/export", null, { responseType: "blob" })
			.then((response) => {
				const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute("download", "AssetReport.xlsx");
				document.body.appendChild(link);
				link.click();
			})
			.catch((err) => {
				console.error(err);
			});
	};

	return {
		data,
		tableHeader,
		total,
		currentPage,
		setCurrentPage,
		handleDownload,
	};
};
export default useStatisticsState;
