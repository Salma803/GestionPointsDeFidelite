import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import '../css/Panier.css'

function Panier() {
    const [products, setProducts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await fetch('http://localhost:3001/client/me', {
                    headers: {
                        accessToken: sessionStorage.getItem("accessToken")
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const userData = await response.json();
                const userId = userData.userId;

                setIsLoggedIn(true);

                const responsePanier = await axios.get(`http://localhost:3001/panierenligne/${userId}`);
                setProducts(responsePanier.data);

                calculateTotal(responsePanier.data);
            } catch (error) {
                console.error('Error fetching user data or cart items:', error);
            }
        };

        fetchCartItems();
    }, []);

    const calculateTotal = (cartItems) => {
        const totalPanier = cartItems.reduce((acc, item) => {
            return acc + (item.quantité * item.Produit.prixApresSolde);
        }, 0);
        setTotal(totalPanier);
    };

    const handleAddQuantity = async (id) => {
        try {
            await axios.put(`http://localhost:3001/panierenligne/ajouter/${id}`);
            const updatedProducts = products.map(item => item.id === id ? { ...item, quantité: item.quantité + 1 } : item);
            setProducts(updatedProducts);
            calculateTotal(updatedProducts);
        } catch (error) {
            console.error('Error adding quantity:', error);
        }
    };

    const handleSubtractQuantity = async (id) => {
        try {
            await axios.put(`http://localhost:3001/panierenligne/soustraire/${id}`);
            const updatedProducts = products.map(item => item.id === id ? { ...item, quantité: item.quantité - 1 } : item);
            setProducts(updatedProducts);
            calculateTotal(updatedProducts);
        } catch (error) {
            console.error('Error subtracting quantity:', error);
        }
    };

    const handleDeleteItem = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/panierenligne/${id}`);
            const updatedProducts = products.filter(item => item.id !== id);
            setProducts(updatedProducts);
            calculateTotal(updatedProducts);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleClearCart = async () => {
        try {
            const response = await fetch('http://localhost:3001/client/me', {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken")
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const userData = await response.json();
            const userId = userData.userId;

            await axios.delete(`http://localhost:3001/panierenligne/client/${userId}`);
            setProducts([]);
            setTotal(0);
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    const handlePurchaseCart = async () => {
        try {
            const response = await fetch('http://localhost:3001/client/me', {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken")
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const userData = await response.json();
            const userId = userData.userId;

            // Purchase cart on backend
            await axios.post(`http://localhost:3001/panierenligne/achat/${userId}`);

            // Update loyalty card after purchase
            await updateLoyaltyCard();

            // Update gift cards after purchase

            // Clear products and total
            setProducts([]);
            setTotal(0);
        } catch (error) {
            console.error('Error purchasing cart:', error);
        }
    };

    const updateLoyaltyCard = async () => {
        try {
            const response = await fetch('http://localhost:3001/client/me', {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken")
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const userData = await response.json();
            const userId = userData.userId;

            // Update loyalty card on backend
            await axios.post(`http://localhost:3001/cartefidelite/${userId}`);
        } catch (error) {
            console.error('Error updating loyalty card:', error);
        }
    };

    return (
        <Container className="cart-container mt-5">
            <h2 className="cart-header">Panier</h2>
            {products.length > 0 ? (
                <div className="cart-items">
                    <Row>
                        {products.map((item) => (
                            <Col md={4} key={item.id} className="mb-4">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{item.Produit.nom}</Card.Title>
                                        <Card.Text>Prix unitaire: {item.Produit.prixApresSolde} DH</Card.Text>
                                        <Card.Text>Quantité: {item.quantité}</Card.Text>
                                        <Card.Text>Total: {item.quantité * item.Produit.prixApresSolde} DH</Card.Text>
                                        <div className="d-flex justify-content-between">
                                            <Button className='add-button' variant="primary" onClick={() => handleAddQuantity(item.id)}>+</Button>
                                            <Button className='subtract-button' variant="primary" onClick={() => handleSubtractQuantity(item.id)}>-</Button>
                                            <Button  className='delete-button' variant="danger" onClick={() => handleDeleteItem(item.id)}>Supprimer</Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <Alert variant="info" className="mt-3">Total du panier: {total} DH</Alert>
                    <div className="d-flex justify-content-between mt-3">
                        <Button className='clear-cart-button' variant="danger" onClick={handleClearCart}>Supprimer le panier</Button>
                        <Button className='purchase-cart-button' variant="success" onClick={handlePurchaseCart}>Acheter</Button>
                    </div>
                </div>
            ) : (
                <Alert variant="warning">Votre panier est vide.</Alert>
            )}
        </Container>
    );
}

export default Panier;
