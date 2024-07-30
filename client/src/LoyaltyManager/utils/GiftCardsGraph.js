import React, { useEffect, useState } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { getBackendURL } from "../../utils/url";

const GiftCardsChart = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					getBackendURL(`/chequecadeau//admin/pourcentage/timeline`)
				);
				setData(response.data);
				setLoading(false);
			} catch (error) {
				setError("Failed to fetch data");
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>{error}</p>;

	return (
		<ResponsiveContainer width="100%" height={400}>
			<LineChart
				data={data}
				margin={{
					top: 5,
					right: 150,
					left: 0,
					bottom: 5,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="date" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Line
					type="monotone"
					dataKey="valid"
					stroke="#28a745"
					activeDot={{ r: 8 }}
				/>
				<Line type="monotone" dataKey="expired" stroke="#dc3545" />
				<Line type="monotone" dataKey="consumed" stroke="#343a40" />
			</LineChart>
		</ResponsiveContainer>
	);
};

export default GiftCardsChart;
