import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "../css/CreerProduit.css";
import * as Yup from "yup";
import axios from "axios";
import SideNav2 from "../components/SideNav2";
import Footer2 from "../components/Footer2";
import Header2 from "../components/Header2";
import UseAuth from "../hooks/UseAuth";
import UseProductManager from "../hooks/UseProductManager";
import { getBackendURL } from "../../utils/url";

function CreerProduit() {
	const navigate = useNavigate();
	const isAuthenticated = UseAuth();
	const { isProductManager, loading } = UseProductManager();
	const [rayons, setRayons] = useState([]);

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

	const initialValues = {
		nom: "",
		description: "",
		ean1: "",
		ean2: "",
		prix: "",
		id_rayon: "",
		valeur_promotion: "",
		date_debut: "",
		date_fin: "",
	};

	const validationSchema = Yup.object().shape({
		nom: Yup.string().required("Le nom est obligatoire"),
		description: Yup.string().required("La description est obligatoire"),
		ean1: Yup.string().required("L'ean1 est obligatoire"),
		ean2: Yup.string(),
		prix: Yup.number()
			.min(0.1, "Le prix doit être supérieur à 0")
			.required("Le prix est obligatoire"),
		id_rayon: Yup.string().required("Le rayon est obligatoire"),
		valeur_promotion: Yup.number()
			.min(0, "La valeur de promotion doit être positive")
			.max(99, "La valeur de promotion doit être inférieure à 99"),
		date_debut: Yup.date(),
		date_fin: Yup.date().min(
			Yup.ref("date_debut"),
			"La date de fin doit être supérieure à la date de début"
		),
	});

	const onSubmit = async (data, { setSubmitting, setFieldError }) => {
		try {
			const response = await axios.post(
				getBackendURL(`/produit/creerproduits`),
				data
			);
			console.log("Response: ", response.data);
			if (response.status === 201) {
				navigate("/productmanager/produits"); // Navigate to the product manager page on success
			}
		} catch (error) {
			if (error.response) {
				const { status, data } = error.response;
				console.error("Server Error:", error.response);
				alert("Erreur serveur lors de la création du produit");
			} else {
				console.error("Error:", error);
				alert(
					"Une erreur s'est produite lors de la création du produit"
				);
			}
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return <p>Loading...</p>;
	}

	if (!isProductManager) {
		return <p>You do not have access to this section.</p>;
	}

	return (
		<div>
			<Header2 />
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
													className={`form-control ${
														validationSchema.fields
															.nom.validate
															? "required-field"
															: ""
													}`}
												/>
												<ErrorMessage
													name="nom"
													component="div"
													className="error"
												/>
											</div>

											<div className="mb-3">
												<label
													htmlFor="description"
													className="form-label"
												>
													Description :
												</label>
												<Field
													id="description"
													name="description"
													placeholder="Entrez la description"
													className={`form-control ${
														validationSchema.fields
															.nom.validate
															? "required-field"
															: ""
													}`}
												/>
												<ErrorMessage
													name="description"
													component="div"
													className="error"
												/>
											</div>

											<div className="mb-3">
												<label
													htmlFor="ean1"
													className="form-label"
												>
													EAN1 :
												</label>
												<Field
													id="ean1"
													name="ean1"
													placeholder="Entrez l'EAN1"
													className={`form-control ${
														validationSchema.fields
															.nom.validate
															? "required-field"
															: ""
													}`}
												/>
												<ErrorMessage
													name="ean1"
													component="div"
													className="error"
												/>
											</div>

											<div className="mb-3">
												<label
													htmlFor="ean2"
													className="form-label"
												>
													EAN2 :
												</label>
												<Field
													id="ean2"
													name="ean2"
													placeholder="Entrez l'EAN2"
													className="form-control"
												/>
												<ErrorMessage
													name="ean2"
													component="div"
													className="error"
												/>
											</div>

											<div className="mb-3">
												<label
													htmlFor="prix"
													className="form-label"
												>
													Prix :
												</label>
												<Field
													id="prix"
													name="prix"
													placeholder="Entrez le prix"
													type="number"
													className={`form-control ${
														validationSchema.fields
															.nom.validate
															? "required-field"
															: ""
													}`}
												/>

												<ErrorMessage
													name="prix"
													component="div"
													className="error"
												/>
											</div>

											<div className="mb-3">
												<label
													htmlFor="id_rayon"
													className="form-label"
												>
													Rayon :
												</label>
												<Field
													as="select"
													name="id_rayon"
													className={`form-control ${
														validationSchema.fields
															.nom.validate
															? "required-field"
															: ""
													}`}
												>
													<option value="">
														Sélectionnez un rayon
													</option>
													{rayons.map((rayon) => (
														<option
															key={rayon.id}
															value={rayon.id}
														>
															{rayon.nom}
														</option>
													))}
												</Field>
												<ErrorMessage
													name="id_rayon"
													component="div"
													className="error"
												/>
											</div>

											<div className="mb-3">
												<label
													htmlFor="valeur_promotion"
													className="form-label"
												>
													Valeur Promotion :
												</label>
												<Field
													id="valeur_promotion"
													name="valeur_promotion"
													placeholder="Entrez la valeur de promotion"
													type="number"
													className="form-control"
												/>
												<ErrorMessage
													name="valeur_promotion"
													component="div"
													className="error"
												/>
											</div>

											<div className="mb-3">
												<label
													htmlFor="date_debut"
													className="form-label"
												>
													Date de début de promotion:
												</label>
												<Field
													id="date_debut"
													name="date_debut"
													placeholder="Entrez la date de début"
													type="date"
													className="form-control"
												/>
												<ErrorMessage
													name="date_debut"
													component="div"
													className="error"
												/>
											</div>

											<div className="mb-3">
												<label
													htmlFor="date_fin"
													className="form-label"
												>
													Date de fin de promotion :
												</label>
												<Field
													id="date_fin"
													name="date_fin"
													placeholder="Entrez la date de fin"
													type="date"
													className="form-control"
												/>
												<ErrorMessage
													name="date_fin"
													component="div"
													className="error"
												/>
											</div>

											<button
												type="submit"
												className="btn btn-primary"
												disabled={isSubmitting}
											>
												Créer le Produit
											</button>
										</div>
									</Form>
								)}
							</Formik>
						</div>
					</div>
				</div>
			</div>
			<SideNav2 />
			<Footer2 />
		</div>
	);
}

export default CreerProduit;
