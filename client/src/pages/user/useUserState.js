import { useState, useEffect, useMemo } from "react";
export function useUserState() {
	const [data, setData] = useState([]);
	const [tableHeaders, setTableHeaders] = useState([]);
	const [department, setDepartment] = useState([]);
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
		Promise.all([API.getAPI("/user", headers, querys), API.getAPI("/department", headers, querys)]).then(
			([userResponse, departmentResponse]) => {
				const userData = userResponse.data;
				const departmentData = departmentResponse.data;
				setDepartment(departmentData);
				const departmentMap = {};
				departmentData.forEach((department) => {
					departmentMap[department.id] = department.name;
				});
				const customHeaders = ["Username", "Department", "Role", "Position"];
				setTableHeaders(customHeaders);
				const customData = userData.map((item) => {
					return {
						userName: item.userName,
						department: departmentMap[item.departmentId],
						role: item.role,
						position: item.position,
						fullName: item.userInformation.fullName,
						email: item.userInformation.email,
						phoneNumber: item.userInformation.phoneNumber,
						dob: item.userInformation.doateOfBirth,
						avatarPath: item.userInformation.avatarPath,
					};
				});
				setData(customData);
			}
		);
	}, [headers]);
    return {
        data,
        tableHeaders,
    }
}
