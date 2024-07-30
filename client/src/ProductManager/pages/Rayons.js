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

function Rayons() {
	const [loading, setLoading] = useState(true);
	const [editingField, setEditingField] = useState(null);
	const [filteredRayons, setFilteredRayons] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortCriteria, setSortCriteria] = useState("createdAt");
	const [sortOrder, setSortOrder] = useState("desc");
	const { isProductManager, loading: authLoading } = UseProductManager();
	const [rayons, setRayons] = useState([]);
	const isAuthenticated = UseAuth();

	useEffect(() => {
		const fetchRayons = async () => {
			try {
				const response = await axios.get(getBackendURL(`/rayon`));
				setRayons(response.data);
				setFilteredRayons(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching rayons:", error);
				setLoading(false);
			}
		};

		fetchRayons();
	}, []);

	useEffect(() => {
		sortRayons(sortCriteria, sortOrder);
	}, [rayons, sortCriteria, sortOrder]);

	const handleSearchChange = (event) => {
		const query = event.target.value.toLowerCase();
		setSearchQuery(query);
		filterRayons(query);
	};

	const filterRayons = (query) => {
		if (!query) {
			setFilteredRayons(rayons);
			return;
		}

		const filtered = rayons.filter((rayon) =>
			rayon.nom.toLowerCase().includes(query)
		);

		setFilteredRayons(filtered);
	};

	const sortRayons = (criteria, order) => {
		const sorted = [...rayons].sort((a, b) => {
			if (criteria === "createdAt" || criteria === "updatedAt") {
				if (order === "asc") {
					return a[criteria] > b[criteria] ? 1 : -1;
				} else {
					return a[criteria] < b[criteria] ? 1 : -1;
				}
			}
			return 0;
		});
		setFilteredRayons(sorted);
	};

	const handleSortChange = (criteria) => {
		setSortCriteria(criteria);
		setSortOrder(sortOrder === "asc" ? "desc" : "asc");
	};

	const deleteRayon = async (rayonId) => {
		try {
			await axios.delete(getBackendURL(`/rayon/${rayonId}`));
			setRayons(rayons.filter((rayon) => rayon.id !== rayonId));
			setFilteredRayons(
				filteredRayons.filter((rayon) => rayon.id !== rayonId)
			);
			console.log("Rayon deleted successfully");
		} catch (error) {
			console.error("Error deleting rayon:", error);
		}
	};

	const handleEditField = (rayonId, field) => {
		setEditingField({ rayonId, field });
	};

	const handleCancelEdit = () => {
		setEditingField(null);
	};

	const handleVerifyEdit = async (rayonId, field, newValue) => {
		const confirmed = window.confirm(
			`Are you sure to change ${field} to "${newValue}"?`
		);
		if (confirmed) {
			try {
				await axios.put(
					getBackendURL(`/rayon/${rayonId}`),
					{ [field]: newValue },
					{
						headers: {
							accessToken: sessionStorage.getItem("accessToken"),
						},
					}
				);
				alert("Rayon information updated successfully");
				setEditingField(null);
				const response = await axios.get(getBackendURL(`/rayon`));
				setRayons(response.data);
				setFilteredRayons(response.data);
			} catch (error) {
				if (error.response.status === 401) {
					console.error("Server Error:", error.response);
					alert("Il existe déjà un rayon avec ce même nom");
				} else {
					console.error("Error:", error);
					alert(
						"Une erreur s'est produite lors de la mise à jour du rayon"
					);
				}
			}
		}
	};

	const handleFieldChange = (event, field) => {
		const { value } = event.target;
		setRayons((prevRayons) =>
			prevRayons.map((rayon) =>
				rayon.id === editingField.rayonId
					? { ...rayon, [field]: value }
					: rayon
			)
		);
	};

	const renderField = (rayon, field) => {
		if (
			editingField &&
			editingField.rayonId === rayon.id &&
			editingField.field === field
		) {
			return (
				<td>
					<input
						type="text"
						value={rayon[field]}
						onChange={(e) => handleFieldChange(e, field)}
					/>
					<FontAwesomeIcon
						icon={faCheck}
						className="edit-icon"
						onClick={() =>
							handleVerifyEdit(rayon.id, field, rayon[field])
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
					{rayon[field]}
					<FontAwesomeIcon
						icon={faEdit}
						className="edit-icon"
						onClick={() => handleEditField(rayon.id, field)}
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
					<h2>Liste de rayons:</h2>
					<div className="search-container">
						<input
							className="search-input"
							type="text"
							value={searchQuery}
							onChange={handleSearchChange}
							placeholder="Chercher les rayons par nom"
						/>
						<FontAwesomeIcon
							icon={faSearch}
							className="search-icon"
						/>
					</div>
					<div className="sort-buttons">
						<button onClick={() => handleSortChange("createdAt")}>
							Sort by Creation Date
							{sortCriteria === "createdAt" && (
								<FontAwesomeIcon
									icon={
										sortOrder === "asc"
											? faSortUp
											: faSortDown
									}
								/>
							)}
						</button>
						<button onClick={() => handleSortChange("updatedAt")}>
							Sort by Updating Date
							{sortCriteria === "updatedAt" && (
								<FontAwesomeIcon
									icon={
										sortOrder === "asc"
											? faSortUp
											: faSortDown
									}
								/>
							)}
						</button>
					</div>
					<Table striped bordered hover responsive>
						<thead>
							<tr>
								<th>Nom</th>
								<th>Créer le:</th>
								<th>Dernière mise à jour : </th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{filteredRayons.map((rayon) => (
								<tr key={rayon.id}>
									{renderField(rayon, "nom")}
									<td>{rayon.createdAt}</td>
									<td>{rayon.updatedAt}</td>
									<td>
										<FontAwesomeIcon
											icon={faTrash}
											className="delete-icon"
											onClick={() =>
												deleteRayon(rayon.id)
											}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</div>
			</div>
			<SideNav2 />
			<Footer2 />
		</div>
	);
}

export default Rayons;
