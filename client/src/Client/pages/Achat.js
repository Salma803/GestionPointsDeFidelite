import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Table, Form } from 'react-bootstrap';
import '../css/Achat.css';
import UseAuthClient from '../hooks/UseAuthClient';
import SideNav from '../Components/SideNav';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

function Achat() {
    const isAuthenticated = UseAuthClient();
    const [userId, setUserId] = useState(null);
    const [achats, setAchats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDetails, setShowDetails] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('');

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
                    const detailsData = Array.isArray(detailsResponse.data) ? detailsResponse.data : [];
                    return { ...achat, details: detailsData };
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

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSortOrder = (event) => {
        setSortOrder(event.target.value);
    };

    const filteredAndSortedAchats = achats
        .filter(achat =>
            achat.details.some(detail =>
                detail.produit.nom.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
        .sort((a, b) => {
            if (sortOrder === 'points') {
                return b.point - a.point;
            } else if (sortOrder === 'total_achat') {
                return b.total_achat - a.total_achat;
            } else if (sortOrder === 'date_achat') {
                return new Date(b.date_achat) - new Date(a.date_achat);
            } else {
                return 0;
            }
        });

    return (
        <div>
            <Header />
            <SideNav/>
            <div className='client-achats-body'>
                <div className="client-achats-container">
                    <h2 className="client-achats-header">Liste des Achats</h2>
                    <div className='outils-achats'>
                        <Form className="client-outils-achat">
                            <Form.Group controlId="search" className='client-achat-recherche'>
                                <Form.Control
                                    type="text"
                                    placeholder="Rechercher un produit..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                            </Form.Group>
                            <Form.Group controlId="sortOrder" className="client-achat-sort">
                                <Form.Label className='tri-label'>Trier par</Form.Label>
                                <Form.Control as="select" value={sortOrder} onChange={handleSortOrder}>
                                    <option value="">Aucun</option>
                                    <option value="points">Points</option>
                                    <option value="total_achat">Total Achat</option>
                                    <option value="date_achat">Date Achat</option>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </div>
                    {loading && <p>Loading...</p>}
                    {error && <p>{error}</p>}
                    {!loading && !error && filteredAndSortedAchats.length === 0 && 
                        <div className='aucun-achat'>
                            <p>Aucun achat trouvé pour ce client. </p>
                        </div>
                    }
                    {!loading && !error && filteredAndSortedAchats.length > 0 && (
                        <div className="client-achats">
                            <div className='client-cf-screen__content'>
                                <div className="client-cf-screen__background">
                                    <span className="client-cf-screen__background__shape client-cf-screen__background__shape4"></span>
                                    <span className="client-cf-screen__background__shape client-products-screen__background__shape6"></span>
                                    <span className="client-cf-screen__background__shape client-cf-screen__background__shape5"></span>
                                    <span className="client-cf-screen__background__shape client-cf-screen__background__shape3"></span>
                                    <span className="client-cf-screen__background__shape client-cf-screen__background__shape2"></span>
                                    <span className="client-cf-screen__background__shape client-cf-screen__background__shape1"></span>
                                </div>
                                <Row>
                                    {filteredAndSortedAchats.map((achat) => (
                                        <Col key={achat.id}>
                                            <Card className={`client-achat-card ${showDetails[achat.id] ? 'expanded' : ''}`}>
                                                <Card.Body className="achat-body">
                                                    <Card.Title className="client-achat-title">Date: {new Date(achat.date_achat).toLocaleString()}</Card.Title>
                                                    <Card.Text className="client-achat-points">Points: {achat.point}</Card.Text>
                                                    <Card.Text className="client-achat-total">Total: {achat.total_achat} DH</Card.Text>
                                                    <Button className="client-achat-details-bttn" onClick={() => toggleDetails(achat.id)}>
                                                        {showDetails[achat.id] ? 'Masquer Détails' : 'Voir Détails'}
                                                    </Button>
                                                    {showDetails[achat.id] && (
                                                        <div className="client-achat-detail-container">
                                                            {Array.isArray(achat.details) && achat.details.length > 0 ? (
                                                                <Table striped bordered hover>
                                                                    <thead>
                                                                        <tr>
                                                                            <th className='client-achat-header-produit'></th>
                                                                            <th className='client-achat-header-ean1'>EAN</th>
                                                                            <th className='client-achat-header-prix'>Prix</th>
                                                                            <th className='client-achat-header-qte'>Qté</th>
                                                                            <th className='client-achat-header-point'>Point</th>
                                                                            <th className='client-achat-header-total'>Total</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {achat.details.map((detail) => (
                                                                            <tr key={detail.id}>
                                                                                <td className='client-achat-td-produit'>{detail.produit.nom}</td>
                                                                                <td className='client-achat-td-ean1'>{detail.produit.ean1}</td>
                                                                                <td className='client-achat-td-prix'>{detail.produit.prix}</td>
                                                                                <td className='client-achat-td-qte'>{detail.quantite}</td>
                                                                                <td className='client-achat-td-point'>{detail.point}</td>
                                                                                <td className='client-achat-td-total'>{detail.total}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </Table>
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
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Achat;
