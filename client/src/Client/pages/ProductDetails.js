import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Button, Card, Alert } from 'react-bootstrap';
import '../css/ProductDetails.css';
import UseAuthClient from '../hooks/UseAuthClient';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';


function ProductDetails() {
    const isAuthenticated = UseAuthClient();
    const { id } = useParams(); // Get the product ID from the URL
    const [produit, setProduit] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3001/produit/${id}`)
            .then((response) => {
                const product = response.data;
                product.image = `${process.env.PUBLIC_URL}/${product.id}.png`; // Assuming image files are named like '1.png', '2.png', etc.
                setProduit(product);
                setLoading(false);
            })
            .catch((error) => {
                console.error(`Error fetching product ${id}:`, error);
                setError('Failed to fetch product details');
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div>Loading...</div>; // Display a loading indicator while fetching data
    }

    if (error) {
        return <Alert variant="danger">Error: {error}</Alert>; // Display an error message if fetching fails
    }

    return (
        <div>
            <NavBar/>
        <Container >
            <Card className='product-body'>
                <Row className="no-gutters">
                    <Col md={4}>
                        <Card.Img variant="top" src={produit.image} alt={`Image of ${produit.nom}`} className="product-image" />
                    </Col>
                    <Col md={8}>
                        <Card.Body >
                            <Card.Title className='product-title'>Nom du produit : {produit.nom}</Card.Title>
                            <Card.Text>Description du produit : {produit.description}</Card.Text>
                            <Card.Text>Code Produit : {produit.ean1}</Card.Text>
                            {produit.active ? (
                                < div >
                                    <Card.Text>Prix Original : {produit.prixAvantSolde} DH</Card.Text>
                                    <Card.Text>Promotion : {produit.valeurSolde}%</Card.Text>
                                    <Card.Text>Prix Actuel : {produit.prixApresSolde} DH</Card.Text>
                                    <Card.Text>Date de Fin de Promotion : {new Date(produit.dateFinPromo).toLocaleDateString()}</Card.Text>
                                </div>
                            ) : (
                                <Card.Text>Prix : {produit.prix} DH</Card.Text>
                            )}
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container>
        <Footer/>
        </div>
    );
}

export default ProductDetails;
