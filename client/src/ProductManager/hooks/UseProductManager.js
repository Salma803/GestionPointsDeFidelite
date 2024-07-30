import { useState, useEffect } from "react";
import axios from "axios";
import { getBackendURL } from "../../utils/url";

const UseProductManager = () => {
	const [isProductManager, setIsProductManager] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkRole = async () => {
			try {
				const response = await axios.get(
					getBackendURL(`/admin/checkproductmanager`),
					{
						headers: {
							accessToken: sessionStorage.getItem("accessToken"),
						},
					}
				);
				setIsProductManager(response.data.isProductManager);
			} catch (error) {
				console.error("Error checking loyalty manager role:", error);
			} finally {
				setLoading(false);
			}
		};

		checkRole();
	}, []);

	return { isProductManager, loading };
};

export default UseProductManager;
