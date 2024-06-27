import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CarteFidelite() {
    const [carteFidelite, setCarteFidelite] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null); // Assuming you get userId from somewhere

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

    if (!userId) {
        return <div>Loading...</div>; // Assuming you want to show loading until userId is fetched
    }

    if (loading) {
        return <div>Loading...</div>; // Show loading state while fetching loyalty card data
    }

    if (error) {
        return <div>{error}</div>; // Show error message if fetching loyalty card data fails
    }

    return (
        <div className="carte-fidelite">
            {carteFidelite ? (
                <div>
                    <h2>Carte de Fidélité</h2>
                    <p>Points: {carteFidelite.point}</p>
                    <p>Reste: {carteFidelite.reste}</p>
                </div>
            ) : (
                <div>Aucune carte de fidélité trouvée pour ce client.</div>
            )}
        </div>
    );
}

export default CarteFidelite;
