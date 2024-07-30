import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SideNav from "../components/SideNav";
import UseLoyaltyManager from "../hooks/UseLoyaltyManager";
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
import "../css/ListeClients.css";
import UseAuth from "../hooks/UseAuth";
import { getBackendURL } from "../../utils/url";

function ListeClients() {
	const [clients, setClients] = useState([]);
	const [loading1, setLoading] = useState(true);
	const [editingField, setEditingField] = useState(null);
	const [filteredClients, setFilteredClients] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortCriteria, setSortCriteria] = useState("createdAt");
	const [sortOrder, setSortOrder] = useState("desc");
	const { isLoyaltyManager, loading } = UseLoyaltyManager();

	const isAuthenticated = UseAuth();
	useEffect(() => {
		fetchClients();
	}, []);
	useEffect(() => {
		sortClients(sortCriteria, sortOrder);
	}, [clients, sortCriteria, sortOrder]);

	const fetchClients = async () => {
		try {
			const response = await axios.get(
				getBackendURL(`/admin/listeclients`)
			);
			console.log("Fetched data:", response.data);
			if (Array.isArray(response.data)) {
				setClients(response.data);
				setFilteredClients(response.data); // Initialize filtered clients with all clients
			} else {
				setClients([]);
				setFilteredClients([]);
			}
			setLoading(false);
		} catch (error) {
			console.error("Error fetching clients:", error);
			setLoading(false);
		}
	};

	const handleSearchChange = (event) => {
		const query = event.target.value.toLowerCase();
		setSearchQuery(query);
		filterClients(query);
	};

	const handleSearchIconClick = () => {
		filterClients(searchQuery);
	};

	const filterClients = (query) => {
		if (!query) {
			setFilteredClients(clients); // Reset filtered clients to all clients when query is empty
			return;
		}

		const filtered = clients.filter(
			(client) =>
				client.nom.toLowerCase().includes(query) ||
				client.prenom.toLowerCase().includes(query) ||
				client.email.toLowerCase().includes(query) ||
				client.telephone.toLowerCase().includes(query) ||
				client.adresse.toLowerCase().includes(query)
		);

		setFilteredClients(filtered);
	};

	const sortClients = (criteria, order) => {
		const sorted = [...clients].sort((a, b) => {
			if (order === "asc") {
				return new Date(a[criteria]) - new Date(b[criteria]);
			} else {
				return new Date(b[criteria]) - new Date(a[criteria]);
			}
		});
		setFilteredClients(sorted);
	};

	const handleSortChange = (criteria) => {
		setSortCriteria(criteria);
		setSortOrder(sortOrder === "asc" ? "desc" : "asc");
	};

	const deleteClient = async (clientId) => {
		try {
			await axios.delete(getBackendURL(`/admin/${clientId}`));
			setClients(clients.filter((client) => client.id !== clientId));
			setFilteredClients(
				filteredClients.filter((client) => client.id !== clientId)
			);
			console.log("Client deleted successfully");
		} catch (error) {
			console.error("Error deleting client:", error);
		}
	};

	const handleEditField = (clientId, field) => {
		setEditingField({ clientId, field });
	};

	const handleCancelEdit = () => {
		setEditingField(null);
	};

	const handleVerifyEdit = async (clientId, field, newValue) => {
		const confirmed = window.confirm(
			`Are you sure to change ${field} to "${newValue}"?`
		);
		if (confirmed) {
			try {
				await axios.put(
					getBackendURL(`/admin/${clientId}`),
					{ [field]: newValue },
					{
						headers: {
							accessToken: sessionStorage.getItem("accessToken"),
						},
					}
				);
				alert("Client information updated successfully");
				setEditingField(null);
				fetchClients(); // Refresh the client list after update
			} catch (error) {
				console.error(
					`Error updating ${field} for client ${clientId}:`,
					error
				);
				alert(`Error updating ${field}`);
			}
		}
	};

	const handleFieldChange = (event, field) => {
		const { value } = event.target;
		setClients((prevClients) =>
			prevClients.map((client) =>
				client.id === editingField.clientId
					? { ...client, [field]: value }
					: client
			)
		);
	};

	const renderField = (client, field) => {
		if (
			editingField &&
			editingField.clientId === client.id &&
			editingField.field === field
		) {
			return (
				<td>
					<input
						type="text"
						value={client[field]}
						onChange={(e) => handleFieldChange(e, field)}
					/>
					<FontAwesomeIcon
						icon={faCheck}
						className="edit-icon"
						onClick={() =>
							handleVerifyEdit(client.id, field, client[field])
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
					{client[field]}
					<FontAwesomeIcon
						icon={faEdit}
						className="edit-icon"
						onClick={() => handleEditField(client.id, field)}
					/>
				</td>
			);
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
			<div className="admin-produits-container">
				<div className="client-cf-screen__background">
					<span className="client-cf-screen__background__shape screen__background__shape4"></span>
					<span className="client-cf-screen__background__shape screen__background__shape3"></span>
					<span className="client-cf-screen__background__shape screen__background__shape2"></span>
					<span className="client-cf-screen__background__shape screen__background__shape1"></span>
				</div>
				<div className="client-cf-screen__content">
					<h2>Liste de clients:</h2>
					<div className="search-container">
						<input
							className="search-input"
							type="text"
							value={searchQuery}
							onChange={handleSearchChange}
							placeholder="Search clients by name, email, or telephone"
						/>
						<FontAwesomeIcon
							icon={faSearch}
							onClick={handleSearchIconClick}
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
							Sort by Modification Date
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
					<Table className="table" striped bordered hover responsive>
						<thead>
							<tr>
								<th>#</th>
								<th>First Name</th>
								<th>Last Name</th>
								<th>Email</th>
								<th>Adresse</th>
								<th>Téléphone</th>
								<th>Crée le:</th>
								<th>Dernière modification</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredClients.length === 0 ? (
								<tr>
									<td
										colSpan="9"
										className="no-clients-message"
									>
										No clients found
									</td>
								</tr>
							) : (
								filteredClients.map((client, index) => (
									<tr key={client.id}>
										<td>{index + 1}</td>
										{renderField(client, "nom")}
										{renderField(client, "prenom")}
										{renderField(client, "email")}
										{renderField(client, "adresse")}
										{renderField(client, "telephone")}
										<td>{client.createdAt}</td>
										<td>{client.updatedAt}</td>
										<td>
											<FontAwesomeIcon
												icon={faTrash}
												className="delete-icon"
												style={{ color: "#ed0c0c" }}
												onClick={() =>
													deleteClient(client.id)
												}
											/>
										</td>
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

export default ListeClients;
