import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { PlusCircle } from 'phosphor-react';
import axios from 'axios';
import '../css/ClientHome.css';

function ClientHome() {
    const [products, setProducts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    let navigate = useNavigate();

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await fetch('http://localhost:3001/client/me', {
                    headers: {
                        accessToken: sessionStorage.getItem("accessToken")
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setUserId(data.userId);
                setIsLoggedIn(true); // Assuming successful fetch means user is logged in

                // Fetch products once userId is fetched
                axios.get("http://localhost:3001/produit/produits")
                    .then((response) => {
                        const products = response.data.map(product => ({
                            ...product,
                            image: `${process.env.PUBLIC_URL}/${product.id}.png` , // Assuming image files are named like '1.png', '2.png', etc.
                        }));
                        setProducts(products);
                    })
                    .catch((error) => {
                        console.error('Error fetching products:', error);
                    });
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Handle error states (e.g., setUserId(null), show error message)
            }
        };

        fetchUserId();
    }, []);

    const addToCart = (productId) => {
        if (!isLoggedIn) {
            alert("Please log in to add products to your cart");
            navigate("/client"); // Redirect to login page
            return;
        }

        const cartItem = {
            quantité: 1,
            id_client: userId,
            id_produit: productId
        };

        axios.post('http://localhost:3001/panierenligne', cartItem, {
            headers: {
                accessToken: sessionStorage.getItem("accessToken")
            }
        })
        .then((response) => {
            console.log('Product added to cart:', response.data);
            alert('Product added to cart');
        })
        .catch((error) => {
            console.error('Error adding product to cart:', error);
            alert('Error adding product to cart');
        });
    };

    return (
        <Container className="mt-5">
            <div className="product-section">
                <h2 className="section-title">Liste des Produits</h2>
                <Row xs={1} md={2} lg={3} className="g-4">
                    {products.map((product) => (
                        <Col key={product.id}>
                            <Card className="product-card">
                                <Link to={`/client/produit/${product.id}`}>
                                    <div className="image-div">
                                        <Card.Img variant="top" src={product.image} alt={product.nom} className="product-image" />
                                    </div>
                                </Link>
                                <Card.Body>
                                    <Card.Title>{product.nom}</Card.Title>
                                    <Card.Text>{product.description}</Card.Text>
                                    {!product.active && (
                                        <Card.Text className="prix">Prix: {product.prixAvantSolde} DH</Card.Text>
                                    )}
                                    {product.active && (
                                        <>
                                            <Card.Text className="Solde">Promotion: {product.valeurSolde}%</Card.Text>
                                            <div>
                                                <Card.Text className="prixNSolde">{product.prixAvantSolde} DH</Card.Text>
                                                <Card.Text className="prixSolde">{product.prixApresSolde} DH</Card.Text>
                                            </div>
                                        </>
                                    )}
                                    <Button variant="secondary" onClick={() => addToCart(product.id)}>
                                        <PlusCircle size={24} />
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </Container>
    );
}    
export default ClientHome;
