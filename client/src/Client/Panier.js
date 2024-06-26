import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Panier.css';

function Panier() {
    const [products, setProducts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [total, setTotal] = useState(0); // State to hold the total amount

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                // Fetch user data to get userId
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

                setIsLoggedIn(true); // Assuming successful fetch means user is logged in

                // Fetch cart items once userId is fetched
                const responsePanier = await axios.get(`http://localhost:3001/panierenligne/${userId}`);

                // Assuming the response.data contains an array of cart items
                setProducts(responsePanier.data); // Update products state with cart items

        
            } catch (error) {
                console.error('Error fetching user data or cart items:', error);
                // Handle error states (e.g., setProducts([]), show error message)
            }
        };

        fetchCartItems();
    }, []);

    // Function to calculate the total amount
    const calculateTotal = (updatedProducts) => {
        const totalPanier = updatedProducts.reduce((acc, item) => {
            return acc + (item.quantité * item.Produit.prix);
        }, 0);
        setTotal(totalPanier);
    };

    // Function to handle adding quantity
    const handleAddQuantity = async (id) => {
        try {
            const response = await axios.put(`http://localhost:3001/panier/ajouter/${id}`);
            // Update products state with updated quantity
            const updatedProducts = products.map(item => item.id === id ? { ...item, quantité: item.quantité + 1 } : item);
            setProducts(updatedProducts);
            calculateTotal(updatedProducts);
        } catch (error) {
            console.error('Error adding quantity:', error);
        }
    };

    // Function to handle subtracting quantity
    const handleSubtractQuantity = async (id) => {
        try {
            const response = await axios.put(`http://localhost:3001/panier/soustraire/${id}`);
            // Update products state with updated quantity
            const updatedProducts = products.map(item => item.id === id ? { ...item, quantité: item.quantité - 1 } : item);
            setProducts(updatedProducts);
            calculateTotal(updatedProducts);
        } catch (error) {
            console.error('Error subtracting quantity:', error);
        }
    };

    return (
        <div>
            <h2>Panier</h2>
            {products.length > 0 ? (
                <div className="cart-items">
                    {products.map((item) => (
                        <div key={item.id} className="cart-item">
                            <div className="product-details">
                                <h3>{item.Produit.nom}</h3>
                                <p>Prix unitaire: {item.Produit.prix} DH</p>
        
                            </div>
                            <div className="quantity">
                                <p className="quantity-text">Quantité: {item.quantité}</p>
                                <button className='addButton' onClick={() => handleAddQuantity(item.id)}>+</button>
                                <button className='subtractButton' onClick={() => handleSubtractQuantity(item.id)}>-</button>
                            </div>
                            <div className="product-details">
                            <p>Total: {item.quantité * item.Produit.prix} DH</p>
                            </div>
                        </div>
                    ))}
                    <p className='total'>Total du panier: {total} DH</p>
                </div>
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );
}

export default Panier;
