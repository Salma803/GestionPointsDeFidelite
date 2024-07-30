import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SideNav from "../components/SideNav";
import UseAuth from "../hooks/UseAuth";
import UseLoyaltyManager from "../hooks/UseLoyaltyManager";
import "../css/ListeCarteFidelite.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEdit,
	faCheck,
	faTimes,
	faSearch,
	faTrash,
	faSortUp,
	faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import "../css/ListeClients.css";
import { getBackendURL } from "../../utils/url";

function ListeCarteFidelite() {
	const [carteFidelite, setCarteFidelite] = useState([]);
	const [loading1, setLoading] = useState(true);
	const [editingField, setEditingField] = useState(null);
	const [filteredCarteFidelite, setFilteredCarteFidelite] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortCriteria, setSortCriteria] = useState("id");
	const [sortOrder, setSortOrder] = useState("asc");
	const isAuthenticated = UseAuth();
	const { isLoyaltyManager, loading } = UseLoyaltyManager();

	useEffect(() => {
		fetchCarteFidelite();
	}, []);

	useEffect(() => {
		filterAndSortCarteFidelite(searchQuery, sortCriteria, sortOrder);
	}, [carteFidelite, searchQuery, sortCriteria, sortOrder]);

	const fetchCarteFidelite = async () => {
		try {
			const response = await axios.get(getBackendURL(`/cartefidelite`));
			console.log("Fetched data:", response.data);
			if (Array.isArray(response.data)) {
				setCarteFidelite(response.data);
				setFilteredCarteFidelite(response.data); // Initialize filtered carteFidelite with all carteFidelite
			} else {
				setCarteFidelite([]);
				setFilteredCarteFidelite([]);
			}
			setLoading(false);
		} catch (error) {
			console.error("Error fetching carteFidelite:", error);
			setLoading(false);
		}
	};

	const handleSearchChange = (event) => {
		const query = event.target.value.toLowerCase();
		setSearchQuery(query);
	};

	const filterAndSortCarteFidelite = (query, criteria, order) => {
		let filtered = carteFidelite;
		if (query) {
			filtered = filtered.filter(
				(carte) =>
					carte.Client.nom.toLowerCase().includes(query) ||
					carte.Client.prenom.toLowerCase().includes(query) ||
					carte.Client.email.toLowerCase().includes(query) ||
					carte.Client.telephone.toLowerCase().includes(query)
			);
		}

		const sorted = filtered.sort((a, b) => {
			let aValue = a[criteria];
			let bValue = b[criteria];

			if (criteria === "point" || criteria === "reste") {
				aValue = parseFloat(aValue);
				bValue = parseFloat(bValue);
			}

			if (order === "asc") {
				return aValue - bValue;
			} else {
				return bValue - aValue;
			}
		});

		setFilteredCarteFidelite(sorted);
	};

	const handleSortChange = (criteria) => {
		setSortCriteria(criteria);
		setSortOrder(sortOrder === "asc" ? "desc" : "asc");
	};

	const deleteCarteFidelite = async (carteFideliteId) => {
		try {
			await axios.delete(
				getBackendURL(`/cartefidelite/${carteFideliteId}`)
			);
			const updatedCarteFidelite = carteFidelite.filter(
				(carte) => carte.id !== carteFideliteId
			);
			setCarteFidelite(updatedCarteFidelite);
			setFilteredCarteFidelite(
				updatedCarteFidelite.filter(
					(carte) => carte.id !== carteFideliteId
				)
			);
			console.log("Carte de fidélité deleted successfully");
		} catch (error) {
			console.error("Error deleting carte de fidélité:", error);
		}
	};

	const renderField = (carte, field) => {
		if (field !== "point" && field !== "reste") {
			return <td>{carte[field]}</td>;
		}

		if (
			editingField &&
			editingField.carteId === carte.id &&
			editingField.field === field
		) {
			return (
				<td>
					<input
						type="text"
						value={carte[field]}
						onChange={(e) => handleFieldChange(e, field)}
					/>
					<FontAwesomeIcon
						icon={faCheck}
						className="edit-icon"
						onClick={() =>
							handleVerifyEdit(carte.id, field, carte[field])
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
					{carte[field]}
					<FontAwesomeIcon
						icon={faEdit}
						className="edit-icon"
						onClick={() => handleEditField(carte.id, field)}
					/>
				</td>
			);
		}
	};

	const handleEditField = (carteId, field) => {
		setEditingField({ carteId, field });
	};

	const handleFieldChange = (e, field) => {
		const updatedCarteFidelite = carteFidelite.map((carte) =>
			carte.id === editingField.carteId
				? { ...carte, [field]: e.target.value }
				: carte
		);
		setCarteFidelite(updatedCarteFidelite);
	};

	const handleCancelEdit = () => {
		setEditingField(null);
	};

	const handleVerifyEdit = async (carteId, field, newValue) => {
		const confirmed = window.confirm(
			`Are you sure to change ${field} to "${newValue}"?`
		);
		if (confirmed) {
			try {
				await axios.put(getBackendURL(`/cartefidelite/${carteId}`), {
					[field]: newValue,
				});
				alert("Carte de fidélité updated successfully");
				setEditingField(null);
				fetchCarteFidelite(); // Refresh the carteFidelite list after update
			} catch (error) {
				if (
					error.response &&
					error.response.data &&
					error.response.data.error
				) {
					alert(
						`Error updating ${field}: ${error.response.data.error}`
					);
				} else {
					alert(`Error updating ${field}`);
				}
				console.error(
					`Error updating ${field} for carte de fidélité ${carteId}:`,
					error
				);
			}
		}
	};

	if (loading1 || loading) {
		return <div>Loading...</div>;
	}
	if (!isLoyaltyManager) {
		return <p>You do not have access to this section.</p>;
	}

	return (
		<div>
			<Header />
			<div className="admin-produit-form-container">
				<div className="client-cf-screen__background">
					<span className="client-cf-screen__background__shape screen__background__shape4"></span>
					<span className="client-cf-screen__background__shape screen__background__shape3"></span>
					<span className="client-cf-screen__background__shape screen__background__shape2"></span>
					<span className="client-cf-screen__background__shape screen__background__shape1"></span>
				</div>
				<div className="client-cf-screen__content">
					<h2>List of Carte de Fidélité:</h2>
					<div className="search-container">
						<input
							className="search-input"
							type="text"
							value={searchQuery}
							onChange={handleSearchChange}
							placeholder="Search carte de fidélité by name, email, or telephone"
						/>
						<FontAwesomeIcon
							icon={faSearch}
							onClick={() =>
								filterAndSortCarteFidelite(
									searchQuery,
									sortCriteria,
									sortOrder
								)
							}
							className="search-icon"
						/>
					</div>
					<div className="sort-buttons">
						<button onClick={() => handleSortChange("point")}>
							Sort by Points
							{sortCriteria === "point" && (
								<FontAwesomeIcon
									icon={
										sortOrder === "asc"
											? faSortUp
											: faSortDown
									}
								/>
							)}
						</button>
						<button onClick={() => handleSortChange("reste")}>
							Sort by Reste
							{sortCriteria === "reste" && (
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
								<th>#</th>
								<th>ID carte</th>
								<th>Points</th>
								<th>Reste</th>
								<th>Nom</th>
								<th>Prénom du client</th>
								<th>Email du client</th>
								<th>Téléphone du client</th>
							</tr>
						</thead>
						<tbody>
							{filteredCarteFidelite.length === 0 ? (
								<tr>
									<td colSpan="9">
										No carte de fidélité found
									</td>
								</tr>
							) : (
								filteredCarteFidelite.map((carte, index) => (
									<tr key={carte.id}>
										<td>{index + 1}</td>
										<td>{carte.id}</td>
										<td>{carte.point}</td>
										<td>{carte.reste}</td>
										<td>{carte.Client.nom}</td>
										<td>{carte.Client.prenom}</td>
										<td>{carte.Client.email}</td>
										<td>{carte.Client.telephone}</td>
									</tr>
								))
							)}
						</tbody>
					</Table>
				</div>
			</div>
			<SideNav />
			<Footer />
		</div>
	);
}

export default ListeCarteFidelite;
