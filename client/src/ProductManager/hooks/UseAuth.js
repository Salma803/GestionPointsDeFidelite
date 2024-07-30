import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getBackendURL } from "../../utils/url";

const UseAuth = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await axios.get(getBackendURL(`/checkauth`), {
					headers: {
						accessToken: sessionStorage.getItem("accessToken"),
					},
				});
				console.log("Authentication response:", response);
				if (response.status === 200) {
					setIsAuthenticated(true);
				} else {
					setIsAuthenticated(false);
					navigate("/admin/login");
				}
			} catch (error) {
				console.error("Error checking authentication:", error);
				setIsAuthenticated(false);
				navigate("/admin/login");
			}
		};

		checkAuth();
	}, [navigate]);

	return isAuthenticated;
};

export default UseAuth;
