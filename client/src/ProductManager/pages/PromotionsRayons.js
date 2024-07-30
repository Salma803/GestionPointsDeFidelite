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
	faSearch,
	faSortUp,
	faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import UseAuth from "../hooks/UseAuth";
import UseProductManager from "../hooks/UseProductManager";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getBackendURL } from "../../utils/url";

function PromotionsRayons() {
	const [rayons, setRayons] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editingField, setEditingField] = useState(null);
	const [filteredRayons, setFilteredRayons] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortCriteria, setSortCriteria] = useState("");
	const [sortOrder, setSortOrder] = useState("desc");
	const { isProductManager, loading: authLoading } = UseProductManager();
	const isAuthenticated = UseAuth();

	useEffect(() => {
		fetchRayons();
	}, []);

	useEffect(() => {
		sortRayons(sortCriteria, sortOrder);
	}, [rayons, sortCriteria, sortOrder]);

	const fetchRayons = async () => {
		try {
			const response = await axios.get(getBackendURL(`/rayon/promotion`));
			console.log("Fetched data:", response.data);
			if (Array.isArray(response.data)) {
				setRayons(response.data);
				setFilteredRayons(response.data);
			} else {
				setRayons([]);
				setFilteredRayons([]);
			}
			setLoading(false);
		} catch (error) {
			console.error("Error fetching rayons:", error);
			setLoading(false);
		}
	};

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
			if (criteria === "valeur_promotion" || criteria === "createdAt") {
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
				const updatedData = {};
				if (field === "valeur_promotion") {
					updatedData.valeur_promotion = newValue;
				} else if (field === "date_debut") {
					updatedData.date_debut = new Date(newValue)
						.toISOString()
						.split("T")[0];
				} else if (field === "date_fin") {
					updatedData.date_fin = new Date(newValue)
						.toISOString()
						.split("T")[0];
				}
				await axios.put(
					getBackendURL(`/promotion/rayon/${rayonId}`),
					updatedData,
					{
						headers: {
							accessToken: sessionStorage.getItem("accessToken"),
						},
					}
				);
				alert("Rayon information updated successfully");
				setEditingField(null);
				fetchRayons();
			} catch (error) {
				console.error("Error:", error);
				alert(
					"Une erreur s'est produite lors de la mise à jour de la promotion"
				);
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

	const handleDateChange = (date, field) => {
		setRayons((prevRayons) =>
			prevRayons.map((rayon) =>
				rayon.id === editingField.rayonId
					? { ...rayon, [field]: date.toISOString().split("T")[0] }
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
					{field === "date_debut" || field === "date_fin" ? (
						<DatePicker
							selected={new Date(rayon[field])}
							onChange={(date) => handleDateChange(date, field)}
							dateFormat="yyyy-MM-dd"
						/>
					) : (
						<input
							type="text"
							value={rayon[field]}
							onChange={(e) => handleFieldChange(e, field)}
						/>
					)}
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
					{field === "date_debut" || field === "date_fin"
						? new Date(rayon[field]).toLocaleDateString()
						: rayon[field]}
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
					<h2>Liste de promotions rayon:</h2>
					<div className="search-container">
						<input
							className="search-input"
							type="text"
							value={searchQuery}
							onChange={handleSearchChange}
							placeholder="Search rayons by name"
						/>
						<FontAwesomeIcon
							icon={faSearch}
							className="search-icon"
						/>
					</div>
					<div className="sort-buttons">
						<button
							onClick={() => handleSortChange("valeur_promotion")}
						>
							Sort by Promotion Value
							{sortCriteria === "valeur_promotion" && (
								<FontAwesomeIcon
									icon={
										sortOrder === "asc"
											? faSortUp
											: faSortDown
									}
								/>
							)}
						</button>
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
					</div>
					<Table className="table" striped bordered hover responsive>
						<thead>
							<tr>
								<th>#</th>
								<th>Nom</th>
								<th>Valeur Promotion Rayon</th>
								<th>Date de début promo rayon</th>
								<th>Date de fin promo rayon</th>
								<th>Créé le:</th>
								<th>Dernière modification</th>
							</tr>
						</thead>
						<tbody>
							{filteredRayons.length === 0 ? (
								<tr>
									<td
										colSpan="7"
										className="no-rayons-message"
									>
										No rayons found
									</td>
								</tr>
							) : (
								filteredRayons.map((rayon, index) => (
									<tr key={rayon.id}>
										<td>{index + 1}</td>
										<td>{rayon.nom}</td>
										{renderField(rayon, "valeur_promotion")}
										{renderField(rayon, "date_debut")}
										{renderField(rayon, "date_fin")}
										<td>
											{new Date(
												rayon.createdAt
											).toLocaleDateString()}
										</td>
										<td>
											{new Date(
												rayon.updatedAt
											).toLocaleDateString()}
										</td>
									</tr>
								))
							)}
						</tbody>
					</Table>
				</div>
			</div>
			<SideNav2 />
			<Footer2 />
		</div>
	);
}

export default PromotionsRayons;
