import React, { useState, useEffect } from "react";
import axios from "axios";
import { getBackendURL } from "../../utils/url";

function AchatTotal() {
	const [totalCount, setTotalCount] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTotalCount = async () => {
			try {
				const response = await axios.get(
					getBackendURL(`/achat/compter/total`)
				);
				setTotalCount(response.data.total);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching total :", error);
				setLoading(false);
			}
		};

		fetchTotalCount();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div style={{ backgroundColor: "#bce315" }} className="small-box bg">
			<div className="inner">
				<h3>{totalCount} DH</h3>
				<p>CA</p>
			</div>
			<div className="icon">
				<i className="ion ion-bag" />
			</div>
		</div>
	);
}

export default AchatTotal;
