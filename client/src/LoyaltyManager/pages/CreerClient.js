import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import SideNav from "../components/SideNav";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../css/CreerClient.css";
import UseAuth from "../hooks/UseAuth";
import UseLoyaltyManager from "../hooks/UseLoyaltyManager";
import { getBackendURL } from "../../utils/url";

function CreerClient() {
	const navigate = useNavigate();
	const isAuthenticated = UseAuth();
	const { isLoyaltyManager, loading } = UseLoyaltyManager();

	const initialValues = {
		nom: "",
		prenom: "",
		adresse: "",
		email: "",
		telephone: "",
		mot_de_passe: "",
	};

	const validationSchema = Yup.object().shape({
		nom: Yup.string().required("Le nom est obligatoire"),
		prenom: Yup.string().required("Le prénom est obligatoire"),
		adresse: Yup.string().required("L'adresse est obligatoire"),
		email: Yup.string()
			.email("Format d'email invalide")
			.required("L'email est obligatoire"),
		telephone: Yup.string()
			.matches(
				/^[0-9]{10}$/,
				"Le numéro de téléphone doit contenir exactement 10 chiffres"
			)
			.required("Le numéro de téléphone est obligatoire"),
		mot_de_passe: Yup.string().required("Le mot de passe est obligatoire"),
	});

	const onSubmit = async (data, { setSubmitting, setFieldError }) => {
		try {
			const response = await axios.post(
				getBackendURL(`/admin/creerclient`),
				data
			);
			console.log("Response: ", response.data);
			if (response.status === 201) {
				navigate("/loyaltymanager/listeclients"); // Navigate to the admin page on success
			}
		} catch (error) {
			if (error.response) {
				const { status, data } = error.response;
				if (status === 401) {
					setFieldError("email", data.error);
				} else if (status === 402) {
					setFieldError("telephone", data.error);
				} else {
					console.error("Server Error:", error.response);
					alert("Erreur serveur lors de la création du client");
				}
			} else {
				console.error("Error:", error);
				alert(
					"Une erreur s'est produite lors de la création du client"
				);
			}
		} finally {
			setSubmitting(false);
		}
	};
	if (loading) {
		return <p>Loading...</p>;
	}

	if (!isLoyaltyManager) {
		return <p>You do not have access to this section.</p>;
	}

	return (
		<div>
			<Header />
			<div className="admin-produit-form">
				<div className="admin-produit-form-home">
					<div className="admin-produit-form-container">
						<div className="client-cf-screen__content">
							<Formik
								initialValues={initialValues}
								validationSchema={validationSchema}
								onSubmit={onSubmit}
							>
								{({ isSubmitting }) => (
									<Form>
										<div className="client-cf-screen__background">
											<span className="client-cf-screen__background__shape screen__background__shape4"></span>
											<span className="client-cf-screen__background__shape screen__background__shape3"></span>
											<span className="client-cf-screen__background__shape screen__background__shape2"></span>
											<span className="client-cf-screen__background__shape screen__background__shape1"></span>
										</div>
										<div className="client-cf-screen__content">
											<div className="mb-3">
												<label
													htmlFor="nom"
													className="form-label"
												>
													Nom :
												</label>
												<Field
													id="nom"
													name="nom"
													placeholder="Entrez le nom"
													className="form-control"
												/>
												<ErrorMessage
													name="nom"
													component="div"
													className="error"
												/>
											</div>

											<div className="mb-3">
												<label
													htmlFor="prenom"
													className="form-label"
												>
													Prénom :
												</label>
												<Field
													id="prenom"
													name="prenom"
													placeholder="Entrez le prénom"
													className="form-control"
												/>
												<ErrorMessage
													name="prenom"
													component="div"
													className="error"
												/>
											</div>

											<div className="mb-3">
												<label
													htmlFor="adresse"
													className="form-label"
												>
													Adresse :
												</label>
												<Field
													id="adresse"
													name="adresse"
													placeholder="Entrez l'adresse"
													className="form-control"
												/>
												<ErrorMessage
													name="adresse"
													component="div"
													className="error"
												/>
											</div>

											<div className="mb-3">
												<label
													htmlFor="email"
													className="form-label"
												>
													Email :
												</label>
												<Field
													id="email"
													name="email"
													placeholder="Entrez l'email"
													type="email"
													className="form-control"
												/>
												<ErrorMessage
													name="email"
													component="div"
													className="error"
												/>
											</div>

											<div className="mb-3">
												<label
													htmlFor="telephone"
													className="form-label"
												>
													Téléphone :
												</label>
												<Field
													id="telephone"
													name="telephone"
													placeholder="Entrez le numéro de téléphone"
													className="form-control"
												/>
												<ErrorMessage
													name="telephone"
													component="div"
													className="error"
												/>
											</div>

											<div className="mb-3">
												<label
													htmlFor="mot_de_passe"
													className="form-label"
												>
													Mot de passe :
												</label>
												<Field
													id="mot_de_passe"
													name="mot_de_passe"
													placeholder="Entrez le mot de passe"
													type="password"
													className="form-control"
												/>
												<ErrorMessage
													name="mot_de_passe"
													component="div"
													className="error"
												/>
											</div>

											<button
												type="submit"
												className="btn btn-primary"
												disabled={isSubmitting}
											>
												Créer le Client
											</button>
										</div>
									</Form>
								)}
							</Formik>
						</div>
					</div>
				</div>
			</div>

			<SideNav />
			<Footer />
		</div>
	);
}

export default CreerClient;
