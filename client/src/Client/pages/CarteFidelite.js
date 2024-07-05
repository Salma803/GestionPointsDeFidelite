import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner, Alert, Card, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import '../css/CarteFidelite.css';

function CarteFidelite_ChequeCadeau() {
    const [chequesCadeaux, setChequesCadeaux] = useState([]);
    const [carteFidelite, setCarteFidelite] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // Current page of gift cards
    const [itemsPerPage] = useState(6); // Number of items per page
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
                    setLoading(false);
                } catch (error) {
                    setError('Failed to fetch loyalty card data');
                    console.error('Error fetching loyalty card data:', error);
                    setLoading(false);
                }
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
                    setError('Failed to fetch gift cards data');
                    console.error('Error fetching gift cards data:', error);
                    setLoading(false);
                }
            }
        };

        fetchUserData();
        fetchCarteFidelite();
        fetchChequesCadeaux();
    }, [userId]);

    const handleUpdate = async () => {
        if (!isLoggedIn) {
            alert("Please log in to view your loyalty card");
            navigate("/client");
            return;
        }

        try {
            const loyaltyResponse = await axios.post(`http://localhost:3001/chequecadeau/${userId}`, {}, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken")
                }
            });

            if (loyaltyResponse.status === 201) {
                alert('Points insuffisants');
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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = chequesCadeaux.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    if (!userId) {
        return <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>;
    }

    if (loading) {
        return <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div className="carte-et-cheque-cadeau">
            {carteFidelite && (
                <div className='Carte-Fidelite'>
                    <h2 className='carteFidelité'>Carte de Fidélité</h2>
                    <p className='points'>Points: {carteFidelite.point}</p>
                    <p className='reste'>Reste: {carteFidelite.reste}</p>
                    <Button className='bouttonChequeCadeau' onClick={handleUpdate}>Convertir mes points en chèque cadeau</Button>
                </div>
            )}

            <div className="cheques-cadeaux">
                <h2 className="cheques-cadeaux-header">Chèques Cadeaux</h2>
                <Row xs={1} md={2} lg={3} className="g-4">
                    {currentItems.length > 0 ? (
                        currentItems.map((cheque) => (
                            <Col key={cheque.id}>
                                <Card className='cheque-card'>
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

                {chequesCadeaux.length > itemsPerPage && (
                    <div className="pagination">
                        <Button variant="outline-primary" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                            Précédent
                        </Button>
                        <Button variant="outline-primary" onClick={() => paginate(currentPage + 1)} disabled={indexOfLastItem >= chequesCadeaux.length}>
                            Suivant
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CarteFidelite_ChequeCadeau;
