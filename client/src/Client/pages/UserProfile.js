import React, { useState, useEffect } from "react";
import { getBackendURL } from "../../utils/url";

function UserProfile() {
	const [userId, setUserId] = useState(null);

	useEffect(() => {
		// Retrieve accessToken from local storage
		const accessToken = localStorage.getItem("accessToken");

		// Simulated API request to get user data
		fetch(getBackendURL(`/client/me`), {
			headers: {
				accessToken: sessionStorage.getItem("accessToken"),
			},
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((data) => {
				setUserId(data.userId); // Assuming API response contains userId
			})
			.catch((error) => {
				console.error("Error:", error);
				// Handle error states (e.g., setUserId(null), show error message)
			});
	}, []);

	return (
		<div>
			<h2>User Profile</h2>
			{userId ? <p>User ID: {userId}</p> : <p>Loading...</p>}
		</div>
	);
}

export default UserProfile;
