import React, { useState, useEffect } from "react";
import axios from "axios";
import { getBackendURL } from "../../utils/url";

function ExpiredCardsCount() {
	const [expiredcardcount, setexpiredcardcount] = useState(0);
	const [expiredcardsPercentage, setexpiredcardsPercentage] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchExpiredGiftCardsData = async () => {
			try {
				const response = await axios.get(
					getBackendURL(`/chequecadeau/admin/pourcentage`)
				);
				const { expired } = response.data;

				setexpiredcardcount(expired.count);
				setexpiredcardsPercentage(expired.percentage);

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
		<div
			style={{ backgroundColor: "#bce315" }}
			className="small-box bg-danger "
		>
			<div className="inner">
				<p>Expired Gift Cards</p>
				<h3>
					{expiredcardsPercentage}
					<sup style={{ fontSize: 20 }}>%</sup>
				</h3>
			</div>
			<div className="icon">
				<i className="ion ion-checkmark" />
			</div>
		</div>
	);
}

export default ExpiredCardsCount;
