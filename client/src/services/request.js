import axios from "axios";

const baseURL = process.env.REACT_APP_API_ENDPOINT;
const defaultHeaders = {
	"Content-Type": "application/json",
	Authorization: `Bearer ${localStorage.getItem("token")}`,
	Accept: "application/json",
};
const login = async (payload) => {
	const response = await axios.post(`${baseURL}/auth/login`, payload);
	const data = await response;
	return data;
};
const getAPI = async (url, querys, options) => {
	const response = await axios.get(baseURL + url, { headers: defaultHeaders, params: querys, ...options });
	const data = response;
	return data;
};
const postAPI = async (url, headers = defaultHeaders, payload) => {
	const response = await axios.post(baseURL + url, payload, { headers: headers });
	const data = response;
	return data;
};
const patchAPI = async (url, payload) => {
	const response = await axios.patch(baseURL + url, payload, { headers: defaultHeaders });
	const data = response;
	return data;
};
const deleteAPI = async (url) => {
	const response = await axios.delete(baseURL + url, { headers: defaultHeaders });
	const data = response;
	return data;
};
const API = { login, getAPI, postAPI, patchAPI, deleteAPI };
export default API;
