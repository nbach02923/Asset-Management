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
const postAPI = async (url, headers, payload) => {
	const response = await axios.post(baseURL + url, payload, { headers: headers });
	const data = await response;
	return data;
};
const patchAPI = async (url, headers, payload) => {
	const response = await axios.patch(baseURL + url, payload, { headers: headers });
	const data = await response;
	return data;
};
const deleteAPI = async (url, headers) => {
	const response = await axios.delete(baseURL + url, { headers: headers });
	const data = await response;
	return data;
};
const API = { login, getAPI, postAPI, patchAPI, deleteAPI };
export default API;
