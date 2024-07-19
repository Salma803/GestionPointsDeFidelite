import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import '../css/Panier.css';
import UseAuthClient from '../hooks/UseAuthClient';
import SideNav from '../Components/SideNav';
import Header from '../Components/Header';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import { PlusCircle,MinusCircle,Trash,XCircle,ShoppingBag } from 'phosphor-react';

function Panier() {
    const isAuthenticated = UseAuthClient();
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
    <div>
        <Header />
        <SideNav/>
        <div className='client-panier-body'>
            <Container className="client-panier-container">
                <h2 className="client-panier-header">Panier</h2>
                {products.length > 0 ? (
                    <div className="client-panier-elements">
                         <div className='client-cf-screen__content'>

                        <div className="client-cf-screen__background">
                                <span className="client-cf-screen__background__shape client-cf-screen__background__shape4"></span>
                                <span className="client-cf-screen__background__shape client-products-screen__background__shape6"></span>
                                <span className="client-cf-screen__background__shape client-cf-screen__background__shape5"></span>
                                <span className="client-cf-screen__background__shape client-cf-screen__background__shape3"></span>
                                <span className="client-cf-screen__background__shape client-cf-screen__background__shape2"></span>
                                <span className="client-cf-screen__background__shape client-cf-screen__background__shape1"></span>
                            </div>
                        <Row className='client-panier-row'>
                            {products.map((item) => (
                                <Col md={4} key={item.id} >
                                    <Card className='client-panier-element'>
                                        <Card.Body className='client-panier-element-body'>
                                            <Card.Title className='client-panier-element-titre'>{item.Produit.nom}</Card.Title>
                                            <Card.Text className='client-panier-element-PU'>Prix unitaire: {item.Produit.prixApresSolde} DH</Card.Text>
                                            <Card.Text className='client-panier-element-Qte'>Quantité: {item.quantité}</Card.Text>
                                            <Card.Text className='client-panier-element-Total'>Total: {item.quantité * item.Produit.prixApresSolde} DH</Card.Text>
                                            <div className="d-flex justify-content-between">
                                                <PlusCircle className='client-panier-add-button'  size={30} onClick={() => handleAddQuantity(item.id)} />
                                                <MinusCircle className='client-panier-subtract-button'  size={30}  onClick={() => handleSubtractQuantity(item.id)} />
                                                <Trash className='client-panier-delete-button'  size={30}  onClick={() => handleDeleteItem(item.id)} />
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                        <Alert variant="info" className="mt-3">Total du panier: {total} DH</Alert>
                        </div>
                        <div className="d-flex justify-content-between mt-3">
                        
                        <XCircle className='client-panier-clear-button' size={40} onClick={handleClearCart}/>
                        <ShoppingBag className='client-panier-purchase-button'  size={40} onClick={handlePurchaseCart}/>
                    </div>
                    </div>
                ) : (
                    <Alert variant="warning">Votre panier est vide.</Alert>
                )}
            </Container>
        </div>
        <Footer />
    </div>
);

}

export default Panier;
