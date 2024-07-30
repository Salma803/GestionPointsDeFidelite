import React, { useState, useEffect } from "react";
import axios from "axios";
import { getBackendURL } from "../../utils/url";

function ConsumedcardsCount() {
	const [consumedcardcount, setconsumedcardcount] = useState(0);
	const [consumedcardsPercentage, setconsumedcardsPercentage] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchExpiredGiftCardsData = async () => {
			try {
				const response = await axios.get(
					getBackendURL(`/chequecadeau/admin/pourcentage`)
				);
				const { consumed } = response.data;

				setconsumedcardcount(consumed.count);
				setconsumedcardsPercentage(consumed.percentage);

				setLoading(false);
			} catch (error) {
				console.error("Error fetching valid gift cards data:", error);
				setLoading(false);
			}
		};

		fetchExpiredGiftCardsData();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="small-box bg-dark">
			<div className="inner">
				<p>Consumed Gift Cards</p>
				<h3>
					{consumedcardsPercentage}
					<sup style={{ fontSize: 20 }}>%</sup>
				</h3>
			</div>
			<div className="icon">
				<i className="ion ion-checkmark" />
			</div>
		</div>
	);
}

export default ConsumedcardsCount;
