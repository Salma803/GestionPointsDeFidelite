import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Card, Col, Row } from 'react-bootstrap';
import '../css/ChequeCadeau.css';

function ChequeCadeau() {
    const [chequesCadeaux, setChequesCadeaux] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

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
                    setLoading(false);
                } catch (error) {
                    setError('Vous n\'avez pas encore de chéque cadeaux');
                    console.error('Error fetching gift cards data:', error);
                    setLoading(false);
                }
            }
        };

        fetchUserData();
        fetchChequesCadeaux();
    }, [userId]);

    if (!userId) {
        return <div>Loading...</div>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div className="cheques-cadeaux">
            <h2 className="cheques-cadeaux-header">Chèques Cadeaux</h2>
            <Row xs={1} md={2} lg={3} className="g-4">
                {chequesCadeaux.length > 0 ? (
                    chequesCadeaux.map((cheque) => (
                        <Col key={cheque.id}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>{cheque.code}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        Date d'expiration: {new Date(cheque.date_expiration).toLocaleDateString()}
                                    </Card.Subtitle>
                                    <Card.Text>
                                        Statut: {cheque.statut}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Alert variant="info" className="no-cheques-message">Aucun chèque cadeau trouvé pour ce client.</Alert>
                )}
            </Row>
        </div>
    );
}

export default ChequeCadeau;
