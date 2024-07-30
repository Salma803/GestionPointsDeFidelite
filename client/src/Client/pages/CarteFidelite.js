import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Button,
	Spinner,
	Alert,
	Table,
	Dropdown,
	DropdownButton,
} from "react-bootstrap";
import axios from "axios";
import "../css/CarteFidelite.css";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import UseAuthClient from "../hooks/UseAuthClient";
import NavBar from "../Components/NavBar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import SideNav from "../Components/SideNav";
import { getBackendURL } from "../../utils/url";

function CarteFidelite_ChequeCadeau() {
	const isAuthenticated = UseAuthClient();
	const [chequesCadeaux, setChequesCadeaux] = useState([]);
	const [carteFidelite, setCarteFidelite] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [userId, setUserId] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(6);
	const [sortOrder, setSortOrder] = useState("asc");
	const [filterStatus, setFilterStatus] = useState("All");
	const [isBackVisible, setIsBackVisible] = useState(false);
	const [cc, setCc] = useState(true);
	const [hidden, setHidden] = useState(true);

	let navigate = useNavigate();

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await fetch(getBackendURL(`/client/me`), {
					headers: {
						accessToken: sessionStorage.getItem("accessToken"),
					},
				});

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				const data = await response.json();
				setUserId(data.userId);
				setIsLoggedIn(true);
			} catch (error) {
				setError("Failed to fetch user data");
				console.error("Error fetching user data:", error);
			}
		};

		const fetchCarteFidelite = async () => {
			if (userId) {
				try {
					const response = await axios.get(
						getBackendURL(`/cartefidelite/touver/${userId}`),
						{
							headers: {
								accessToken:
									sessionStorage.getItem("accessToken"),
							},
						}
					);
					setCarteFidelite(response.data);
					setLoading(false);
				} catch (error) {
					setError("Failed to fetch loyalty card data");
					console.error("Error fetching loyalty card data:", error);
					setLoading(false);
				}
			}
		};

		const fetchChequesCadeaux = async () => {
			if (userId) {
				try {
					const response = await axios.get(
						getBackendURL(`/chequecadeau/${userId}`),
						{
							headers: {
								accessToken:
									sessionStorage.getItem("accessToken"),
							},
						}
					);

					setChequesCadeaux(response.data);
					setLoading(false);
				} catch (error) {
					if (error.response && error.response.status === 404) {
						setError("Vous n'avez pas encore de chéque cadeau ");
						setCc(false);
					} else {
						setError("Failed to fetch gift cards data");
					}
					console.error("Error fetching gift cards data:", error);
					setLoading(false);
				}
			}
		};

		fetchUserData();
		fetchCarteFidelite();
		fetchChequesCadeaux();
	}, [userId]);

	const handleUpdate = async () => {
		if (!isLoggedIn) {
			alert("Please log in to view your loyalty card");
			navigate("/client");
			return;
		}

		try {
			const loyaltyResponse = await axios.post(
				getBackendURL(`/chequecadeau/${userId}`),
				{},
				{
					headers: {
						accessToken: sessionStorage.getItem("accessToken"),
					},
				}
			);

			if (loyaltyResponse.status === 201) {
				alert("Points insuffisants");
				return;
			}

			await axios.post(
				getBackendURL(`/chequecadeau/${userId}`),
				{},
				{
					headers: {
						accessToken: sessionStorage.getItem("accessToken"),
					},
				}
			);

			alert("Loyalty card and gift cards updated successfully");
			navigate("/chequecadeau");
		} catch (error) {
			console.error("Error updating loyalty card and gift cards:", error);
			alert("Error updating loyalty card and gift cards");
		}
	};

	const handleSort = () => {
		const sorted = [...chequesCadeaux].sort((a, b) => {
			const dateA = new Date(a.date_expiration);
			const dateB = new Date(b.date_expiration);

			return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
		});

		setChequesCadeaux(sorted);
		setSortOrder(sortOrder === "asc" ? "desc" : "asc");
	};

	const handleFilter = (status) => {
		setFilterStatus(status);
	};

	const handleCardClick = () => {
		setIsBackVisible(!isBackVisible);
	};

	const handleCardHide = () => {
		setHidden(!hidden);
	};

	const filteredCheques =
		filterStatus === "All"
			? chequesCadeaux
			: chequesCadeaux.filter((cheque) => cheque.statut === filterStatus);

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = filteredCheques.slice(
		indexOfFirstItem,
		indexOfLastItem
	);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	if (!userId) {
		return (
			<Spinner animation="border" role="status">
				<span className="sr-only">Loading...</span>
			</Spinner>
		);
	}

	if (loading) {
		return (
			<Spinner animation="border" role="status">
				<span className="sr-only">Loading...</span>
			</Spinner>
		);
	}

	if (error) {
		return <Alert variant="danger">{error}</Alert>;
	}

	return (
		<div>
			<SideNav />
			<Header />
			<body className="client-cf-body">
				<div className="client-cf-screen__background">
					<span className="client-cf-screen__background__shape client-cf-screen__background__shape4"></span>
					<span className="client-cf-screen__background__shape client-cf-screen__background__shape3"></span>
					<span className="client-cf-screen__background__shape client-cf-screen__background__shape2"></span>
					<span className="client-cf-screen__background__shape client-cf-screen__background__shape1"></span>
				</div>
				<div className="client-cf-screen__content">
					<div className="client-cf-et-cc">
						<div className="client-cf">
							{carteFidelite && carteFidelite.Client && (
								<div
									className="client-cf-front"
									onDoubleClick={handleCardClick}
								>
									<div className="client-cf-screen__background">
										<span className="client-cf-screen__background__shape screen__background__shape4"></span>
										<span className="client-cf-screen__background__shape screen__background__shape3"></span>
										<span className="client-cf-screen__background__shape screen__background__shape2"></span>
										<span className="client-cf-screen__background__shape screen__background__shape1"></span>
									</div>
									<div className="client-cf-screen__content">
										<faSyncAlt
											onClick={handleUpdate}
											style={{
												cursor: "pointer",
												marginLeft: "10px",
											}}
										/>
										<h2 className="client-titre-cf">
											Carte de Fidélité
										</h2>
										<p className="client-nom">
											Nom: {carteFidelite.Client.nom}
										</p>
										<p className="client-prenom">
											Prénom:{" "}
											{carteFidelite.Client.prenom}
										</p>
									</div>
								</div>
							)}
							{carteFidelite && carteFidelite.Client && (
								<div
									className={`client-cf-back ${
										isBackVisible ? "show" : ""
									}`}
								>
									<div className="client-cf-screen__background">
										<span className="client-cf-screen__background__shape screen__background__shape4"></span>
										<span className="client-cf-screen__background__shape screen__background__shape3"></span>
										<span className="client-cf-screen__background__shape screen__background__shape2"></span>
										<span className="client-cf-screen__background__shape screen__background__shape1"></span>
									</div>
									<div className="client-cf-screen__content">
										<faSyncAlt
											onClick={handleUpdate}
											style={{
												cursor: "pointer",
												marginLeft: "10px",
											}}
										/>
										<p className="client-point-cf">
											Points: {carteFidelite.point}
										</p>
										<p className="client-reste-cf">
											Reste: {carteFidelite.reste}
										</p>
									</div>
								</div>
							)}
						</div>

						<div className="client-cc">
							<h2 className="client-titre-cc">Chèques Cadeaux</h2>

							<div className="client-actions-cc">
								<Button
									className="client-cc-bttn-sort"
									variant="outline-secondary"
									onClick={handleSort}
								>
									Sort by Date Expiration (
									{sortOrder === "asc"
										? "Ascending"
										: "Descending"}
									)
								</Button>
								<DropdownButton
									className="client-cc-filter"
									variant="outline-secondary"
									id="dropdown-basic-button"
									title={`Filter by Status: ${filterStatus}`}
								>
									<Dropdown.Item
										onClick={() => handleFilter("All")}
									>
										All
									</Dropdown.Item>
									<Dropdown.Item
										onClick={() => handleFilter("Valide")}
									>
										Valide
									</Dropdown.Item>
									<Dropdown.Item
										onClick={() => handleFilter("expiré")}
									>
										Expirée
									</Dropdown.Item>
									<Dropdown.Item
										onClick={() => handleFilter("consommé")}
									>
										Consommée
									</Dropdown.Item>
								</DropdownButton>
							</div>

							<Table
								className="client-table-cc"
								striped
								bordered
								hover
							>
								<thead>
									<tr>
										<th className="client-cc-code-header">
											Code
										</th>
										<th className="client-cc-date-expiration-header">
											Date Expiration
										</th>
										<th className="client-cc-statut-header">
											Statut
										</th>
									</tr>
								</thead>
								<tbody>
									{chequesCadeaux.length > 0 ? (
										currentItems.map((cheque) => (
											<tr key={cheque.id}>
												<td className="client-cc-code-content">
													{cheque.code}
												</td>
												<td className="client-cc-date-expiration-content">
													{new Date(
														cheque.date_expiration
													).toLocaleDateString()}
												</td>
												<td className="client-cc-statut-content">
													{cheque.statut}
												</td>
											</tr>
										))
									) : (
										<tr>
											<td colSpan="3">
												<Alert
													variant="info"
													className="no-cc-message"
												>
													Vous n'avez pas encore de
													chéque cadeaux.
												</Alert>
											</td>
										</tr>
									)}
								</tbody>
							</Table>

							{filteredCheques.length > itemsPerPage && (
								<div className="pagination">
									<Button
										variant="outline-primary"
										onClick={() =>
											paginate(currentPage - 1)
										}
										disabled={currentPage === 1}
									>
										Précédent
									</Button>
									<Button
										variant="outline-primary"
										onClick={() =>
											paginate(currentPage + 1)
										}
										disabled={
											indexOfLastItem >=
											filteredCheques.length
										}
									>
										Suivant
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
			</body>
			<Footer />
		</div>
	);
}

export default CarteFidelite_ChequeCadeau;
