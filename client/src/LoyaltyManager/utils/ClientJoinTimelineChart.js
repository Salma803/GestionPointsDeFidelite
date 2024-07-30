import React, { Component } from "react";
import {
	BarChart,
	Bar,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip,
} from "recharts";
import axios from "axios";
import { getBackendURL } from "../../utils/url";

class ClientJoinTimelineChart extends Component {
	state = {
		data: [],
		loading: true,
		error: null,
	};

	async componentDidMount() {
		try {
			const response = await axios.get(
				getBackendURL(`/client/admin/pourcentage/timeline`)
			);
			this.setState({ data: response.data, loading: false });
		} catch (error) {
			this.setState({ error: error.message, loading: false });
		}
	}

	render() {
		const { data, loading, error } = this.state;

		if (loading) {
			return <div>Loading...</div>;
		}

		if (error) {
			return <div>Error: {error}</div>;
		}

		return (
			<ResponsiveContainer width="100%" height={400}>
				<BarChart
					data={data}
					margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
				>
					<XAxis dataKey="date" />
					<YAxis />
					<Tooltip />
					<Bar dataKey="clients" fill="#8884d8" />
				</BarChart>
			</ResponsiveContainer>
		);
	}
}

export default ClientJoinTimelineChart;
