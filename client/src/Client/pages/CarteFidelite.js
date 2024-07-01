import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner, Alert } from 'react-bootstrap'; // Import React Bootstrap components
import axios from 'axios';
import '../css/CarteFidelite.css';

function CarteFidelite() {
    const [carteFidelite, setCarteFidelite] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null); // Assuming you get userId from somewhere
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Assuming you check login status somewhere
    let navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
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
                setIsLoggedIn(true);
            } catch (error) {
                setError('Failed to fetch user data');
                console.error('Error fetching user data:', error);
            }
        };

        const fetchCarteFidelite = async () => {
            if (userId) {
                try {
                    const response = await axios.get(`http://localhost:3001/cartefidelite/touver/${userId}`, {
                        headers: {
                            accessToken: sessionStorage.getItem("accessToken")
                        }
                    });
                    setCarteFidelite(response.data);
                    setLoading(false); // Set loading to false after successful fetch
                } catch (error) {
                    setError('Failed to fetch loyalty card data');
                    console.error('Error fetching loyalty card data:', error);
                    setLoading(false); // Set loading to false on error
                }
            }
        };

        fetchUserData();
        fetchCarteFidelite();
    }, [userId]); // useEffect dependency on userId

    const handleUpdate = async () => {
        if (!isLoggedIn) {
            alert("Please log in to view your loyalty card");
            navigate("/client"); // Redirect to login page
            return;
        }

        try {
            const loyaltyResponse = await axios.post(`http://localhost:3001/chequecadeau/${userId}`, {}, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken")
                }
            });

            if (loyaltyResponse.status === 201) {
                alert('points insuffisants');
                return;
            }

            await axios.post(`http://localhost:3001/chequecadeau/${userId}`, {}, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken")
                }
            });

            alert('Loyalty card and gift cards updated successfully');
            navigate('/chequecadeau');
        } catch (error) {
            console.error('Error updating loyalty card and gift cards:', error);
            alert('Error updating loyalty card and gift cards');
        }
    };

    if (!userId) {
        return <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>; // Show loading spinner until userId is fetched
    }

    if (loading) {
        return <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>; // Show loading spinner while fetching loyalty card data
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>; // Show error message if fetching loyalty card data fails
    }

    return (
        <div className="carte-fidelite">
            {carteFidelite ? (
                <div className='Carte-Fidelite'>
                    <h2 className='carteFidelité'>Carte de Fidélité</h2>
                    <p className='points'>Points: {carteFidelite.point}</p>
                    <p className='reste'>Reste: {carteFidelite.reste}</p>
                    <Button className='bouttonChequeCadeau' onClick={handleUpdate}>Convertir mes points en chèque cadeau</Button>
                </div>
            ) : (
                <Alert variant="info">Aucune carte de fidélité trouvée pour ce client.</Alert>
            )}
        </div>
    );
}

export default CarteFidelite;
