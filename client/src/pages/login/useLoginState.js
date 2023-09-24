import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/request";

const useLoginState = () => {
	const navigate = useNavigate();
	const [userName, setUserName] = useState("");
	const [password, setPassword] = useState("");
	const [openSuccess, setOpenSuccess] = useState(false);
	const [openError, setOpenError] = useState(false);
	const [status, setStatus] = useState(null);
	const [message, setMessage] = useState(null);
	const [countdown, setCountdown] = useState(3);
	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => {
		setShowPassword((prevShowPassword) => !prevShowPassword);
	};
	const handleMouseDownPassword = (e) => {
		e.preventDefault();
	};
	const handleCloseSuccess = () => {
		setOpenSuccess(false);
	};
	const handleCloseError = () => {
		setOpenError(false);
	};
	const handleLogin = async (e) => {
		e.preventDefault();
		const payload = { userName, password };
		API.login(payload)
			.then((response) => {
				if (response.status === 200) {
					setOpenSuccess(true);
					localStorage.setItem("token", response.data.accessToken);
					setTimeout(() => {
						navigate("/");
						window.location.reload();
					}, 3000);
				} else {
					setOpenError(true);
					setStatus(response.status);
					setMessage(response.data.message);
				}
			})
			.catch((err) => {
				setOpenError(true);
				setStatus(err.response.status);
				setMessage(err.response.data.message);
			});
	};
	useEffect(() => {
		if (openSuccess) {
			const timer = setInterval(() => {
				setCountdown((prevCountdown) => prevCountdown - 1);
			}, 1000);
			return () => clearInterval(timer);
		}
	}, [openSuccess]);
	return {
		userName,
		password,
		openSuccess,
		openError,
		status,
		message,
		countdown,
		showPassword,
		handleClickShowPassword,
		handleMouseDownPassword,
		handleCloseSuccess,
		handleCloseError,
		handleLogin,
		setUserName,
		setPassword,
	};
};
export default useLoginState;
