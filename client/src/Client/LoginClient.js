import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './LoginClient.css';

function LoginClients() {
  const [email, setEmail] = useState("");
  const [mot_de_passe, setMotDePasse] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = { email, mot_de_passe };
      const response = await axios.post(
        "http://localhost:3001/client/login",
        data
      );
      if (response.data.error) {
        alert(response.data.error);
      } else {
        sessionStorage.setItem("accessToken", response.data.accessToken);
        navigate("/client/home");
      }
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };
  return (
    <div className="LoginClient">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2>Se connecter</h2>
          <div>
            <label>Email:</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Mot de passe:</label>
            <input
              type="mot_de_passe"
              value={mot_de_passe}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
            />
          </div>
          <button type="submit">Je me connecte</button>
        </form>
      </div>
    </div>
  );
}

export default LoginClients;
