import { useState, useEffect } from "react";
import API from "../../services/request";

const colorMap = {
	"Ready to Deploy": "#47b39c",
	Deployed: "#ffc154",
	Error: "#ec6b56",
};
const useDashBoardState = () => {
	const [assetData, setAssetData] = useState([]);
	const [assetTotal, setAssetTotal] = useState(0);
	const [data, setData] = useState([]);
	const [tableHeader, setTableHeader] = useState([]);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);
	useEffect(() => {
		Promise.all([API.getAPI("/asset", { limit: 1000 }), API.getAPI("/recentAct")]).then(
			([assetResponse, recentActResponse]) => {
				const assetData = assetResponse.data;
				const recentActData = recentActResponse.data;
				const statusCount = {};
				assetData.asset.forEach((item) => {
					statusCount[item.status] = (statusCount[item.status] || 0) + 1;
				});
				const chartAssetData = Object.entries(statusCount).map(([status, count], _index) => {
					return {
						x: status,
						y: count,
						label: `${status}: ${count}`,
						color: colorMap[status],
					};
				});
				setAssetData(chartAssetData);
				setAssetTotal(assetData.assetTotal);
				const customData = recentActData.activities.map((item) => {
					let name;
					if (item.name) {
						name = item.name;
					} else if (item.userName) {
						name = item.userName;
					} else {
						name = "";
					}
					const updateDate = new Date(item.updateAt);
					const formattedUpdateDate = updateDate.toLocaleString("vi-vn");
					return {
						name: name,
						updateAt: formattedUpdateDate,
						message: item.message,
					};
				});
				setData(customData);
				const customHeaders = ["Name", "Update At", "Activity"];
				setTableHeader(customHeaders);
				setTotal(recentActData.actTotal);
			}
		);
	}, []);
	return {
		assetData,
		assetTotal,
		data,
		tableHeader,
		total,
		currentPage,
		setCurrentPage,
	};
};
export default useDashBoardState;
