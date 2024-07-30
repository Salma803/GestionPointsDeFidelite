import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Alert,
	Form,
	Button,
	Table,
	Container,
	Row,
	Col,
} from "react-bootstrap";
import NavBar from "../Components/NavBar";
import SideNav from "../Components/SideNav";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import "../css/Reclamations.css";
import { getBackendURL } from "../../utils/url";

const Reclamations = () => {
	const [objet, setObjet] = useState("");
	const [contenu, setContenu] = useState("");
	const [reclamations, setReclamations] = useState([]);
	const [idClient, setIdClient] = useState(null); // Set this according to your application logic

	useEffect(() => {
		// Fetch client ID and reclamations
		const fetchData = async () => {
			try {
				const response = await axios.get(getBackendURL(`/client/me`), {
					headers: {
						accessToken: sessionStorage.getItem("accessToken"),
					},
				});
				const idClient = response.data.userId; // Adjust based on your backend response
				setIdClient(idClient);
				const reclamationsResponse = await axios.get(
					getBackendURL(`/reclamation/${idClient}`)
				);
				setReclamations(reclamationsResponse.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, []);

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			await axios.post(getBackendURL(`/reclamation/${idClient}`), {
				objet,
				contenu,
			});
			setObjet("");
			setContenu("");

			// Refresh the list of reclamations
			const reclamationsResponse = await axios.get(
				getBackendURL(`/reclamation/${idClient}`)
			);
			setReclamations(reclamationsResponse.data);
		} catch (error) {
			console.error("Error creating reclamation:", error);
		}
	};

	return (
		<div>
			<Header />
			<SideNav />
			<div className="client-reclamations-body">
				<div className="client-reclamations-container">
					<div className="client-cf-screen__content">
						<div className="client-cf-screen__background">
							<span className="client-cf-screen__background__shape client-cf-screen__background__shape4"></span>
							<span className="client-cf-screen__background__shape client-products-screen__background__shape6"></span>
							<span className="client-cf-screen__background__shape client-cf-screen__background__shape5"></span>
							<span className="client-cf-screen__background__shape client-cf-screen__background__shape3"></span>
							<span className="client-cf-screen__background__shape client-cf-screen__background__shape2"></span>
							<span className="client-cf-screen__background__shape client-cf-screen__background__shape1"></span>
						</div>
						<Row>
							<Col>
								<div className="client-reclamation-header">
									Créer une nouvelle réclamation?
								</div>
								<Form onSubmit={handleSubmit}>
									<Form.Group
										className="client-reclamation-form-objet"
										controlId="formObjet"
									>
										<Form.Label>Objet</Form.Label>
										<Form.Control
											className="client-objet-input"
											type="text"
											value={objet}
											onChange={(e) =>
												setObjet(e.target.value)
											}
											required
										/>
									</Form.Group>
									<Form.Group
										className="client-reclamation-form-contenu"
										controlId="formContenu"
									>
										<Form.Label>Contenu</Form.Label>
										<Form.Control
											className="client-contenu-input"
											type="text"
											value={contenu}
											onChange={(e) =>
												setContenu(e.target.value)
											}
											required
										/>
									</Form.Group>
									<div className="client-reclamation-send-bttn">
										<Button
											className="send-button-reclamation"
											type="submit"
										>
											Envoyer
										</Button>
									</div>
								</Form>
							</Col>
						</Row>
						<div className="client-cf-screen__content">
							<Row>
								<div className="client-table-reclamation">
									<h2>Réclamations existantes</h2>
									{reclamations.length > 0 ? (
										<Table striped bordered hover>
											<thead>
												<tr>
													<th className="client-reclamation-table-header">
														ID
													</th>
													<th className="client-reclamation-table-header">
														Objet
													</th>
													<th className="client-reclamation-table-header">
														Contenu
													</th>
													<th className="client-reclamation-table-header">
														Statut
													</th>
													<th className="client-reclamation-table-header">
														Réponse
													</th>
													<th className="client-reclamation-table-header">
														Date de création
													</th>
												</tr>
											</thead>
											<tbody>
												{reclamations.map(
													(reclamation) => (
														<tr
															key={reclamation.id}
															className={
																reclamation.statut ===
																"traité"
																	? "traité"
																	: "non-traité"
															}
														>
															<td>
																{reclamation.id}
															</td>
															<td>
																{
																	reclamation.objet
																}
															</td>
															<td>
																{
																	reclamation.contenu
																}
															</td>
															<td>
																{
																	reclamation.statut
																}
															</td>
															<td>
																{reclamation.réponse ===
																null
																	? "Une réponse sera à votre disposition dans peu de temps"
																	: reclamation.réponse}
															</td>
															<td>
																{new Date(
																	reclamation.createdAt
																).toLocaleDateString()}
															</td>
														</tr>
													)
												)}
											</tbody>
										</Table>
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
								</div>
							</Row>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default Reclamations;
