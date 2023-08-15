import axios from "axios";

const baseURL = process.env.REACT_APP_API_ENDPOINT;
const login = async (payload) => {
	const response = await axios.post(`${baseURL}/auth/login`, payload);
	const data = await response;
	return data;
};
const getAPI = async (url, headers, querys) => {
	const response = await axios.get(baseURL + url, { headers: headers, params: querys });
	const data = await response;
	return data;
};
const API = { login, getAPI };
export default API;
