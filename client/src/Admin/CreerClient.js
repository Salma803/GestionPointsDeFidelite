import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import './CreerClient.css';


function CreerClient() {
  const navigate = useNavigate();

  const initialValues = {
    nom: "",
    prenom: "",
    adresse: "",
    email: "",
    mot_de_passe:"",
  };

  const validationSchema = Yup.object().shape({
    nom: Yup.string().required("Le nom est obligatoire"),
    prenom: Yup.string().required("Le prénom est obligatoire"),
    adresse: Yup.string().required("L'adresse est obligatoire"),
    email: Yup.string()
      .email("Format d'email invalide")
      .required("L'email est obligatoire"),
    mot_de_passe: Yup.string().required("L'adresse est obligatoire"),
  });

  const onSubmit = async (data, { setSubmitting }) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/admin/creerclient",
        data,
        {
          headers: {
            accessToken: sessionStorage.getItem("accessToken"),
          },
        }
      );
      console.log("Response: ", response.data);
      if (response.data.error) {
        alert(response.data.error);
      } else {
        navigate("/listclients"); // Navigate to the admin page on success
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire!", error);
      alert("Erreur lors de la soumission du formulaire!");
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="form4">
      <div className="homeR4">
        <Link to="/" className="backButton4">
          Accueil
        </Link>
        <div className="formContainer"> {/* Ensure this matches the class name in CSS */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <label>Nom :</label>
                <ErrorMessage name="nom" component="span" className="error" />
                <Field
                  id="inputNomClient"
                  name="nom"
                  placeholder="(Ex. Azize..)"
                />

                <label>Prénom :</label>
                <ErrorMessage name="prenom" component="span" className="error" />
                <Field
                  id="inputPrenomClient"
                  name="prenom"
                  placeholder="(Ex. Salma..)"
                />
                <label>Adresse :</label>
                <ErrorMessage name="adresse" component="span" className="error" />
                <Field
                  id="inputAdresse"
                  name="adresse"
                  placeholder="(Ex. 123 Main St..)"
                />

                <label>Email :</label>
                <ErrorMessage name="email" component="span" className="error" />
                <Field
                  id="inputEmailClient"
                  name="email"
                  placeholder="(Ex. salma@gmail.com)"
                />

                <label>Mot de passe :</label>
                <ErrorMessage name="mot_de_passe" component="span" className="error" />
                <Field
                  id="inputMotdepasse"
                  name="mot_de_passe"
                  placeholder="(Ex. salma#100AZ99)"
                />
                <button type="submit" disabled={isSubmitting}>
                  Créer le Client
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
export default CreerClient;