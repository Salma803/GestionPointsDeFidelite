import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Footer2 from "../components/Footer2";

import SideNav2 from "../components/SideNav2";
import Header2 from "../components/Header2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEdit,
	faCheck,
	faTimes,
	faTrash,
	faSearch,
	faSortUp,
	faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import UseAuth from "../hooks/UseAuth";
import UseProductManager from "../hooks/UseProductManager";
import { getBackendURL } from "../../utils/url";

function Regles() {
	const [regles, setRegles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editingField, setEditingField] = useState(null);
	const isAuthenticated = UseAuth();
	const { isProductManager, loading: authLoading } = UseProductManager();

	useEffect(() => {
		const fetchRegles = async () => {
			try {
				const response = await axios.get(getBackendURL(`/regle`));
				setRegles(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching regles:", error);
				setLoading(false);
			}
		};

		fetchRegles();
	}, []);

	const handleEditField = (regleId, field) => {
		setEditingField({ regleId, field });
	};
	const handleFieldChange = (event, field) => {
		const { value } = event.target;
		setRegles((prevRegles) =>
			prevRegles.map((regle) =>
				regle.id === editingField.regleId
					? { ...regle, [field]: value }
					: regle
			)
		);
	};

	const handleCancelEdit = () => {
		setEditingField(null);
	};

	const handleVerifyEdit = async (regleId, field, newValue) => {
		const confirmed = window.confirm(
			`Are you sure to change ${field} to "${newValue}"?`
		);
		if (confirmed) {
			try {
				const regleToUpdate = regles.find(
					(regle) => regle.id === regleId
				);
				const updatedRegle = {
					...regleToUpdate,
					[field]: newValue,
				};

				await axios.put(
					getBackendURL(`/regle/${regleId}`),
					updatedRegle,
					{
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				alert("Regles information updated successfully");
				setEditingField(null);

				// Refresh the list of rules after update
				const response = await axios.get(getBackendURL(`/regle`));
				setRegles(response.data);
			} catch (error) {
				console.error("Error:", error);
				alert("An error occurred while updating the rule");
			}
		}
	};

	const renderField = (regle, field) => {
		if (
			editingField &&
			editingField.regleId === regle.id &&
			editingField.field === field
		) {
			return (
				<td>
					<input
						type="text"
						value={regle[field]}
						onChange={(e) => handleFieldChange(e, field)}
					/>
					<FontAwesomeIcon
						icon={faCheck}
						className="edit-icon"
						onClick={() =>
							handleVerifyEdit(regle.id, field, regle[field])
						}
					/>
					<FontAwesomeIcon
						icon={faTimes}
						className="edit-icon"
						onClick={handleCancelEdit}
					/>
				</td>
			);
		} else {
			return (
				<td>
					{regle[field]}
					<FontAwesomeIcon
						icon={faEdit}
						className="edit-icon"
						onClick={() => handleEditField(regle.id, field)}
					/>
				</td>
			);
		}
	};

	if (loading || authLoading) {
		return <div>Loading...</div>;
	}
	if (!isProductManager) {
		return <p>You do not have access to this section.</p>;
	}

	return (
		<div>
			<Header2 />

			<div className="admin-produits-container">
				<div className="client-cf-screen__background">
					<span className="client-cf-screen__background__shape screen__background__shape4"></span>
					<span className="client-cf-screen__background__shape screen__background__shape3"></span>
					<span className="client-cf-screen__background__shape screen__background__shape2"></span>
					<span className="client-cf-screen__background__shape screen__background__shape1"></span>
				</div>
				<div className="client-cf-screen__content">
					<h2>Liste de règles</h2>
					<Table striped bordered hover responsive>
						<thead>
							<tr>
								<th>Rayon</th>
								<th>Multiplicité</th>
							</tr>
						</thead>
						<tbody>
							{regles.map((regle) => (
								<tr key={regle.id}>
									<td>{regle.Rayon.nom}</td>
									{renderField(regle, "multiplicite")}
								</tr>
							))}
						</tbody>
					</Table>
				</div>
			</div>
			<SideNav2 />
		</div>
	);
}

export default Regles;
