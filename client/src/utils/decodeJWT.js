const decodeJWT = () => {
	const token = localStorage.getItem("token");
	if (token !== null) {
		const payload = token.split(".")[1];
		const decodePayload = atob(payload);
		const jsonPayload = JSON.parse(decodePayload);
		return jsonPayload;
	}
	return {};
};
export default decodeJWT;
