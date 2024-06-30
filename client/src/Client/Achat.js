import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

function Achat() {
    const [userId, setUserId] = useState(null);
    const [achats, setAchats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDetails, setShowDetails] = useState({});

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
                fetchAchatsAndDetails(data.userId);
            } catch (error) {
                setError('Failed to fetch user data');
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const fetchAchatsAndDetails = async (clientId) => {
        try {
            const response = await axios.get(`http://localhost:3001/achat/${clientId}`);
            const achatsData = response.data;

            const achatsWithDetails = await Promise.all(
                achatsData.map(async (achat) => {
                    const detailsResponse = await axios.get(`http://localhost:3001/achat/detail/${achat.id}`);
                    return { ...achat, details: detailsResponse.data };
                })
            );

            setAchats(achatsWithDetails);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch purchases and details');
            console.error('Error fetching purchases and details:', error);
            setLoading(false);
        }
    };

    const toggleDetails = (id) => {
        setShowDetails(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    return (
        <Container className="mt-5">
            <h2>Liste des Achats</h2>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && achats.length === 0 && <p>Aucun achat trouvé pour ce client.</p>}
            {!loading && !error && achats.length > 0 && (
                <Row>
                    {achats.map((achat) => (
                        <Col md={6} key={achat.id}>
                            <Card className="mb-4">
                                <Card.Body>
                                    <Card.Title>Date: {new Date(achat.date_achat).toLocaleString()}</Card.Title>
                                    <Card.Text>Points: {achat.point}</Card.Text>
                                    <Card.Text>Total: {achat.total_achat} DH</Card.Text>
                                    <Button variant="primary" onClick={() => toggleDetails(achat.id)}>
                                        
                                        {showDetails[achat.id] ? 'Masquer Détails' : 'Voir Détails'}
                                    </Button>
                                    {showDetails[achat.id] && (
                                        <div className="details-container mt-3">
                                            {achat.details.length > 0 ? (
                                                achat.details.map((detail) => (
                                                    <div key={detail.id} className="detail-item">
                                                        <p>Quantité: {detail.quantite}</p>
                                                        <p>Total: {detail.total}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>Pas de détails disponibles pour cet achat.</p>
                                            )}
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default Achat;