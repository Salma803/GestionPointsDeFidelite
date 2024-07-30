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
import "../css/Produits.css";
import { getBackendURL } from "../../utils/url";

function Produits() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editingField, setEditingField] = useState(null);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortCriteria, setSortCriteria] = useState("createdAt");
	const [sortOrder, setSortOrder] = useState("desc");
	const { isProductManager, loading: authLoading } = UseProductManager();
	const [rayons, setRayons] = useState([]);
	const isAuthenticated = UseAuth();

	useEffect(() => {
		fetchProducts();
	}, []);

	useEffect(() => {
		const fetchRayons = async () => {
			try {
				const response = await axios.get(getBackendURL(`/rayon`));
				setRayons(response.data);
			} catch (error) {
				console.error("Error fetching rayons:", error);
			}
		};

		fetchRayons();
	}, []);

	useEffect(() => {
		sortProducts(sortCriteria, sortOrder);
	}, [products, sortCriteria, sortOrder]);

	const fetchProducts = async () => {
		try {
			const response = await axios.get(
				getBackendURL(`/produit/produits`)
			);
			console.log("Fetched data:", response.data);
			if (Array.isArray(response.data)) {
				setProducts(response.data);
				setFilteredProducts(response.data);
			} else {
				setProducts([]);
				setFilteredProducts([]);
			}
			setLoading(false);
		} catch (error) {
			console.error("Error fetching products:", error);
			setLoading(false);
		}
	};

	const handleSearchChange = (event) => {
		const query = event.target.value.toLowerCase();
		setSearchQuery(query);
		filterProducts(query);
	};

	const filterProducts = (query) => {
		if (!query) {
			setFilteredProducts(products);
			return;
		}

		const filtered = products.filter(
			(product) =>
				product.nom.toLowerCase().includes(query) ||
				product.ean1.includes(query) ||
				product.Rayon.nom.toLowerCase().includes(query)
		);

		setFilteredProducts(filtered);
	};

	const sortProducts = (criteria, order) => {
		const sorted = [...products].sort((a, b) => {
			if (criteria === "prix" || criteria === "createdAt") {
				if (order === "asc") {
					return a[criteria] > b[criteria] ? 1 : -1;
				} else {
					return a[criteria] < b[criteria] ? 1 : -1;
				}
			}
			return 0;
		});
		setFilteredProducts(sorted);
	};

	const handleSortChange = (criteria) => {
		setSortCriteria(criteria);
		setSortOrder(sortOrder === "asc" ? "desc" : "asc");
	};

	const deleteProduct = async (productId) => {
		try {
			await axios.delete(getBackendURL(`/produit/${productId}`));
			setProducts(products.filter((product) => product.id !== productId));
			setFilteredProducts(
				filteredProducts.filter((product) => product.id !== productId)
			);
			console.log("Product deleted successfully");
		} catch (error) {
			console.error("Error deleting product:", error);
		}
	};

	const handleEditField = (productId, field) => {
		setEditingField({ productId, field });
	};

	const handleCancelEdit = () => {
		setEditingField(null);
	};

	const handleVerifyEdit = async (productId, field, newValue) => {
		const confirmed = window.confirm(
			`Are you sure to change ${field} to "${newValue}"?`
		);
		if (confirmed) {
			try {
				await axios.put(
					getBackendURL(`/produit/${productId}`),
					{ [field]: newValue },
					{
						headers: {
							accessToken: sessionStorage.getItem("accessToken"),
						},
					}
				);
				alert("Product information updated successfully");
				setEditingField(null);
				fetchProducts();
			} catch (error) {
				if (error.response.status === 401) {
					console.error("Server Error:", error.response);
					alert("Il existe déjà un produit avec ce même EAN");
				} else if (error.response) {
					console.error("Server Error:", error.response);
					alert("Il existe déjà un produit avec ce même EAN");
				} else {
					console.error("Error:", error);
					alert(
						"Une erreur s'est produite lors de la mise à jour du produit"
					);
				}
			}
		}
	};

	const handleFieldChange = (event, field) => {
		const { value } = event.target;
		setProducts((prevProducts) =>
			prevProducts.map((product) =>
				product.id === editingField.productId
					? { ...product, [field]: value }
					: product
			)
		);
	};

	const handleRayonChange = (event) => {
		const { value } = event.target;
		setProducts((prevProducts) =>
			prevProducts.map((product) =>
				product.id === editingField.productId
					? { ...product, id_rayon: value }
					: product
			)
		);
	};

	const renderField = (product, field) => {
		if (
			editingField &&
			editingField.productId === product.id &&
			editingField.field === field
		) {
			if (field === "id_rayon") {
				return (
					<td>
						<select
							value={product.id_rayon}
							onChange={handleRayonChange}
						>
							{rayons.map((rayon) => (
								<option key={rayon.id} value={rayon.id}>
									{rayon.nom}
								</option>
							))}
						</select>
						<FontAwesomeIcon
							icon={faCheck}
							className="edit-icon"
							onClick={() =>
								handleVerifyEdit(
									product.id,
									field,
									product.id_rayon
								)
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
						<input
							type="text"
							value={product[field]}
							onChange={(e) => handleFieldChange(e, field)}
						/>
						<FontAwesomeIcon
							icon={faCheck}
							className="edit-icon"
							onClick={() =>
								handleVerifyEdit(
									product.id,
									field,
									product[field]
								)
							}
						/>
						<FontAwesomeIcon
							icon={faTimes}
							className="edit-icon"
							onClick={handleCancelEdit}
						/>
					</td>
				);
			}
		} else {
			return (
				<td>
					{field === "id_rayon" ? product.Rayon.nom : product[field]}
					<FontAwesomeIcon
						icon={faEdit}
						className="edit-icon"
						onClick={() => handleEditField(product.id, field)}
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
					<h2>Liste de produits:</h2>
					<div className="search-container">
						<input
							className="search-input"
							type="text"
							value={searchQuery}
							onChange={handleSearchChange}
							placeholder="chercher les produits par nom, ean1, ou rayon"
						/>
						<FontAwesomeIcon
							icon={faSearch}
							className="search-icon"
						/>
					</div>
					<div className="sort-buttons">
						<button onClick={() => handleSortChange("prix")}>
							Sort by Price
							{sortCriteria === "prix" && (
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
					<Table
						className="admin-produits-table"
						striped
						bordered
						hover
						responsive
					>
						<thead>
							<tr>
								<th>Nom</th>
								<th>EAN1</th>
								<th>EAN2</th>
								<th>Rayon</th>
								<th>Prix</th>
								<th>Créer le:</th>
								<th>Dernière mise à jour : </th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{filteredProducts.map((product) => (
								<tr key={product.id}>
									{renderField(product, "nom")}
									{renderField(product, "ean1")}
									{renderField(product, "ean2")}
									{renderField(product, "id_rayon")}
									{renderField(product, "prix")}
									<td>{product.createdAt}</td>
									<td>{product.updatedAt}</td>
									<td>
										<FontAwesomeIcon
											icon={faTrash}
											className="delete-icon"
											onClick={() =>
												deleteProduct(product.id)
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

export default Produits;
