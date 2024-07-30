import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { PlusCircle } from "phosphor-react";
import axios from "axios";
import "../css/ClientHome.css";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import SideNav from "../Components/SideNav";
import UseAuthClient from "../hooks/UseAuthClient";
import { getBackendURL } from "../../utils/url";

function ClientHome() {
	const isAuthenticated = UseAuthClient();
	const [products, setProducts] = useState([]);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userId, setUserId] = useState(null);

	let navigate = useNavigate();

	useEffect(() => {
		const fetchUserId = async () => {
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
				setIsLoggedIn(true); // Assuming successful fetch means user is logged in

				// Fetch products once userId is fetched
				axios
					.get(getBackendURL(`/produit/produits`))
					.then((response) => {
						const products = response.data.map((product) => ({
							...product,
							image: `${process.env.PUBLIC_URL}/${product.id}.png`, // Assuming image files are named like '1.png', '2.png', etc.
						}));
						setProducts(products);
					})
					.catch((error) => {
						console.error("Error fetching products:", error);
					});
			} catch (error) {
				console.error("Error fetching user data:", error);
				// Handle error states (e.g., setUserId(null), show error message)
			}
		};

		fetchUserId();
	}, []);

	const addToCart = (productId) => {
		if (!isLoggedIn) {
			alert("Please log in to add products to your cart");
			navigate("/client"); // Redirect to login page
			return;
		}

		const cartItem = {
			quantité: 1,
			id_client: userId,
			id_produit: productId,
		};

		axios
			.post(getBackendURL(`/panierenligne`), cartItem, {
				headers: {
					accessToken: sessionStorage.getItem("accessToken"),
				},
			})
			.then((response) => {
				console.log("Product added to cart:", response.data);
				alert("Product added to cart");
			})
			.catch((error) => {
				console.error("Error adding product to cart:", error);
				alert("Error adding product to cart");
			});
	};

	return (
		<div>
			<Header />
			<SideNav />
			<div className="client-products-body">
				<Container className="client-products-container">
					<div className="client-product-section">
						<div className="client-cf-screen__content">
							<div className="client-cf-screen__background">
								<span className="client-cf-screen__background__shape client-cf-screen__background__shape4"></span>
								<span className="client-cf-screen__background__shape client-products-screen__background__shape6"></span>
								<span className="client-cf-screen__background__shape client-cf-screen__background__shape5"></span>
								<span className="client-cf-screen__background__shape client-cf-screen__background__shape3"></span>
								<span className="client-cf-screen__background__shape client-cf-screen__background__shape2"></span>
								<span className="client-cf-screen__background__shape client-cf-screen__background__shape1"></span>
							</div>
							<div className="client-product-cards">
								<Row xs={1} md={2} lg={3} className="g-4">
									{products.map((product) => (
										<Col key={product.id}>
											<Card>
												<div className="client-product-card-home">
													<div className="client-products-image-div">
														<Link
															to={`/client/produit/${product.id}`}
														>
															<div className="client-product-image">
																<Card.Img
																	src={
																		product.image
																	}
																	alt={
																		product.nom
																	}
																	className="product-image"
																/>
															</div>
														</Link>
													</div>
													<Card.Body className="client-product-card-body">
														<Card.Title className="client-product-title">
															{product.nom}
														</Card.Title>
														<Card.Text className="client-product-text">
															{
																product.description
															}
														</Card.Text>
														{!product.active && (
															<Card.Text className="client-product-price">
																Prix:{" "}
																{
																	product.prixAvantSolde
																}{" "}
																DH
															</Card.Text>
														)}
														{product.active && (
															<>
																<Card.Text className="client-product-solde">
																	Promotion:{" "}
																	{
																		product.valeurSolde
																	}
																	%
																</Card.Text>
																<div className="client-product-price-container">
																	<Card.Text className="client-product-PNS">
																		{
																			product.prixAvantSolde
																		}{" "}
																		DH
																	</Card.Text>
																	<Card.Text className="client-product-PS">
																		{
																			product.prixApresSolde
																		}{" "}
																		DH
																	</Card.Text>
																</div>
															</>
														)}
														<PlusCircle
															className="client-button-addToCart"
															size={24}
															onClick={() =>
																addToCart(
																	product.id
																)
															}
														/>
													</Card.Body>
												</div>
											</Card>
										</Col>
									))}
								</Row>
							</div>
						</div>
					</div>
				</Container>
			</div>
			<Footer />
		</div>
	);
}

export default ClientHome;
