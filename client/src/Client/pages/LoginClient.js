import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import { getBackendURL } from "../../utils/url";

function LoginClients() {
	const [email, setEmail] = useState("");
	const [mot_de_passe, setMotDePasse] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const data = { email, mot_de_passe };
			const response = await axios.post(
				getBackendURL(`/client/login`),
				data
			);
			if (response.data.error) {
				alert(response.data.error);
			} else {
				sessionStorage.setItem(
					"accessToken",
					response.data.accessToken
				);
				navigate("/cartefidelite");
			}
		} catch (error) {
			console.error(error);
			alert("Login failed");
		}
	};

	return (
		<div className="body-login">
			<div className="container">
				<div className="screen">
					<div className="screen__content">
						<form className="login" onSubmit={handleSubmit}>
							<div className="login__field">
								<i className="login__icon fas fa-user"></i>
								<input
									type="text"
									className="login__input"
									placeholder=" Email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
							<div className="login__field">
								<i className="login__icon fas fa-lock"></i>
								<input
									type="password"
									className="login__input"
									placeholder="Password"
									value={mot_de_passe}
									onChange={(e) =>
										setMotDePasse(e.target.value)
									}
									required
								/>
							</div>
							<button
								type="submit"
								className="button login__submit"
							>
								<span className="button__text">Log In Now</span>
								<i className="button__icon fas fa-chevron-right"></i>
							</button>
						</form>
						<div className="social-login">
							<h3>log in via</h3>
							<div className="social-icons">
								<a
									href="#"
									className="social-login__icon fab fa-instagram"
								></a>
								<a
									href="#"
									className="social-login__icon fab fa-facebook"
								></a>
								<a
									href="#"
									className="social-login__icon fab fa-twitter"
								></a>
							</div>
						</div>
					</div>
					<div className="screen__background">
						<span className="screen__background__shape screen__background__shape4"></span>
						<span className="screen__background__shape screen__background__shape3"></span>
						<span className="screen__background__shape screen__background__shape2"></span>
						<span className="screen__background__shape screen__background__shape1"></span>
					</div>
				</div>
			</div>
		</div>
	);
}
export default LoginClients;
