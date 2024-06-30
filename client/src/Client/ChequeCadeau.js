import React, { useEffect, useState } from 'react';
import axios from 'axios';


function ChequeCadeau() {
    const [chequesCadeaux, setChequesCadeaux] = useState([]);
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

        const fetchChequesCadeaux = async () => {
            if (userId) {
                try {
                    const response = await axios.get(`http://localhost:3001/chequecadeau/${userId}`, {
                        headers: {
                            accessToken: sessionStorage.getItem("accessToken")
                        }
                    });
                    setChequesCadeaux(response.data);
                    setLoading(false); // Set loading to false after successful fetch
                } catch (error) {
                    setError('Vous n\'avez pas encore de chéque cadeaux');
                    console.error('Error fetching gift cards data:', error);
                    setLoading(false); // Set loading to false on error
                }
            }
        };

        fetchUserData();
        fetchChequesCadeaux();
    }, [userId]); // useEffect dependency on userId

    if (!userId) {
        return <div>Loading...</div>;
    }

    if (loading) {
        return <div>Loading...</div>; 
    }

    if (error) {
        return <div>{error}</div>; 
    }

    return (
        <div className="cheques-cadeaux">
            <h2 className="cheques-cadeaux-header">Chèques Cadeaux</h2>
            {chequesCadeaux.length > 0 ? (
                <ul className="cheques-cadeaux-list">
                    {chequesCadeaux.map((cheque) => (
                        <li key={cheque.id} className="cheque-item">
                            <p className="cheque-code">Code: {cheque.code}</p>
                            <p className="cheque-expiration">Date d'expiration: {new Date(cheque.date_expiration).toLocaleDateString()}</p>
                            <p className="cheque-statut">Statut: {cheque.statut}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="no-cheques-message">Aucun chèque cadeau trouvé pour ce client.</div>
            )}
        </div>
    );
    
}

export default ChequeCadeau;
