import React, { useState, useEffect } from "react";
import axios from "axios";
import { getBackendURL } from "../../utils/url";

function ValidGiftCardsCount() {
	const [validCardsCount, setValidCardsCount] = useState(0);
	const [validCardsPercentage, setValidCardsPercentage] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchValidGiftCardsData = async () => {
			try {
				const response = await axios.get(
					getBackendURL(`/chequecadeau/admin/pourcentage`)
				);
				const { valid } = response.data;

				setValidCardsCount(valid.count);
				setValidCardsPercentage(valid.percentage);

				setLoading(false);
			} catch (error) {
				console.error("Error fetching valid gift cards data:", error);
				setLoading(false);
			}
		};

		fetchValidGiftCardsData();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div style={{ backgroundColor: "#bce315" }} className="small-box bg">
			<div className="inner">
				<p>Valid Gift Cards</p>
				<h3>
					{validCardsPercentage}
					<sup style={{ fontSize: 20 }}>%</sup>
				</h3>
			</div>
			<div className="icon">
				<i className="ion ion-checkmark" />
			</div>
		</div>
	);
}

export default ValidGiftCardsCount;
