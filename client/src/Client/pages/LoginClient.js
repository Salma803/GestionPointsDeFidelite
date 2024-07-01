import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import '../css/Login.css'

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
        "http://localhost:3001/client/login",
        data
      );
      if (response.data.error) {
        setError(response.data.error);
      } else {
        sessionStorage.setItem("accessToken", response.data.accessToken);
        navigate("/client/home");
      }
    } catch (error) {
      console.error(error);
      setError("Login failed");
    }
  };

  return (
    <div className="LoginClient">
      <div className="form-container">
        <Form onSubmit={handleSubmit}>
          <h2>Se connecter</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={mot_de_passe}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default LoginClients;
