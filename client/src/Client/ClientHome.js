import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';


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
                        setProducts(response.data);
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

    const updateLoyaltyCardAndNavigate = async () => {
        if (!isLoggedIn) {
            alert("Please log in to view your loyalty card");
            navigate("/client"); // Redirect to login page
            return;
        }

        try {
            await axios.post(`http://localhost:3001/cartefidelite/${userId}`, {}, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken")
                }
            });

            navigate("/cartefidelite");
        } catch (error) {
            console.error('Error updating loyalty card:', error);
            alert('Error updating loyalty card');
        }
    };
    const navigateChequeCadeau = async () => {
        if (!isLoggedIn) {
            alert("Please log in to view your gift cards");
            navigate("/client"); // Redirect to login page
            return;
        }

    
            navigate("/chequecadeau");
    };
    const navigatePanier = async() => {
        navigate('/panier');
    };
    const navigateAchat = async() => {
        navigate('/achat');
    }

    return (
        <div>
            {/* Navbar */}
            <nav className="custom-navbar">
                <div className="navbar-brand">Your Logo Here</div>
                <ul className="custom-navbar-nav">
                    <li><button className="btn btn-primary" onClick={navigatePanier}>Voir panier</button></li>
                    <li><button className="btn btn-primary" onClick={updateLoyaltyCardAndNavigate}>Voir Carte de Fidélité</button></li>
                    <li><button className="btn btn-primary" onClick={navigateChequeCadeau}>Voir Vos chéque cadeau</button></li>
                    <li><button className="btn btn-primary" onClick={navigateAchat}>Voir mon historique d'achat</button></li>
                </ul>
            </nav>

            {/* Body */}
            <div className="product-section">
                <h2 className="section-title">Liste des Produits</h2>
                <div className="product-list">
                    {products.map((product) => (
                        <div key={product.id} className="product-item">
                            <Link to={`/client/produit/${product.id}`} className="product-link">
                                <h3>{product.nom}</h3>
                                <p>{product.description}</p>
                                {!product.active && (
                                    <p className='prix'>Prix: {product.prixAvantSolde} DH</p>
                                )}
                                {product.active && (
                                    <>
                                        <p className='prixNSolde'>Prix: {product.prixAvantSolde} DH</p>
                                        <p className='Solde'>{product.valeurSolde} %</p>
                                        <p className='prixSolde'>Prix Après Solde: {product.prixApresSolde} DH</p>
                                    </>
                                )}
                            </Link>
                            <button className="btn btn-secondary" onClick={() => addToCart(product.id)}>+</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default ClientHome;
