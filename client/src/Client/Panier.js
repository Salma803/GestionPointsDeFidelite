import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
        <div className="cart-container">
            <h2 className="cart-header">Panier</h2>
            {products.length > 0 ? (
                <div className="cart-items">
                    {products.map((item) => (
                        <div key={item.id} className="cart-item">
                            <div className="product-details">
                                <h3 className="product-name">{item.Produit.nom}</h3>
                                <p className="product-price">Prix unitaire: {item.Produit.prixApresSolde} DH</p>
                            </div>
                            <div className="quantity">
                                <p className="quantity-text">Quantité: {item.quantité}</p>
                                <button className="add-button" onClick={() => handleAddQuantity(item.id)}>+</button>
                                <button className="subtract-button" onClick={() => handleSubtractQuantity(item.id)}>-</button>
                                <button className="delete-button" onClick={() => handleDeleteItem(item.id)}>Supprimer</button>
                            </div>
                            <div className="product-total">
                                <p className="total-price">Total: {item.quantité * item.Produit.prixApresSolde} DH</p>
                            </div>
                        </div>
                    ))}
                    <p className="cart-total">Total du panier: {total} DH</p>
                    <button className="clear-cart-button" onClick={handleClearCart}>Supprimer le panier</button>
                    <button className="purchase-cart-button" onClick={handlePurchaseCart}>Acheter</button>
                </div>
            ) : (
                <p className="empty-cart-message">Votre panier est vide.</p>
            )}
        </div>
    );
    
}

export default Panier;
