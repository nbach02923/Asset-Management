import axios from "axios";

const baseURL = "http://127.0.0.1:2901/api";
const login = async (payload) => {
	try {
		const response = await axios.post(`${baseURL}/auth/login`, payload);
		const data = await response;
		return data;
	} catch (err) {
		console.error(err);
	}
};
const getAPI = async (url, headers = {}, querys = {}) => {
	try {
		const response = await axios.get(baseURL + url, { headers: headers, params: querys });
		const data = await response;
		return data;
	} catch (err) {
		console.error(err);
	}
};
export { login, getAPI };
