import React, { useState, useEffect } from "react";
import axios from "axios";
import { getBackendURL } from "../../utils/url";

function LoyaltyCardsCount() {
	const [loyaltycardCount, setloyaltycardCount] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchloyaltycardCount = async () => {
			try {
				const response = await axios.get(
					getBackendURL(`/cartefidelite/count`)
				);
				setloyaltycardCount(response.data.count);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching gift card count:", error);
				setLoading(false);
			}
		};

		fetchloyaltycardCount();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="small-box bg-yellow">
			<div className="inner">
				<h3>{loyaltycardCount}</h3>
				<p>Loyalty Cards</p>
			</div>
			<div className="icon">
				<i className="ion ion-bag" />
			</div>
		</div>
	);
}

export default LoyaltyCardsCount;
