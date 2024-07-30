import React, { useState, useEffect } from "react";
import axios from "axios";
import { getBackendURL } from "../../utils/url";

function RayonCount() {
	const [rayonCount, setRayonCount] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchRayonCount = async () => {
			try {
				const response = await axios.get(
					getBackendURL(`/rayon/compter/count`)
				);
				setRayonCount(response.data.count);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching rayon count:", error);
				setLoading(false);
			}
		};

		fetchRayonCount();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="small-box bg-yellow">
			<div className="inner">
				<h3>{rayonCount}</h3>
				<p>Rayons</p>
			</div>
			<div className="icon">
				<i className="ion ion-stats-bars" />
			</div>
		</div>
	);
}

export default RayonCount;
