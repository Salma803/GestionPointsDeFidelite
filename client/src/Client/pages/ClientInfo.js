import React, {useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import Header from '../Components/Header';
import SideNav from '../Components/SideNav';
import Footer from '../Components/Footer';
import UseAuthClient from '../hooks/UseAuthClient';
import '../css/ClientInfo.css'
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';

const ClientInfo = () => {
    const [client, setClient] = useState(null);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [email, setEmail] = useState('');
    const [adresse, setAdresse] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const isAuthenticated = UseAuthClient();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClientId = async () => {
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
                const userId = data.userId;
                fetchClient(userId);
            } catch (error) {
                setError('Failed to fetch client ID');
                console.error('Error fetching client ID:', error);
            }
        };

        const fetchClient = async (userId) => {
            try {
                const response = await axios.get(`http://localhost:3001/client/find/${userId}`);
                setClient(response.data);
                setEmail(response.data.email);
                setAdresse(response.data.adresse);
            } catch (error) {
                setError('Failed to fetch client data');
                console.error('Error fetching client data:', error);
            }
        };

        fetchClientId();
    }, []);

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleCancel = () => {
        setEditMode(false);
        setEmail(client.email);
        setAdresse(client.adresse);
        setCurrentPassword('');
        setNewPassword('');
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:3001/client/changer/${client.id}`, {
                email,
                adresse,
                currentPassword,
                newPassword
            });
            setClient({ ...client, email, adresse });
            setEditMode(false);
        } catch (error) {
            if (error.response && error.response.status === 401){
                setError('Le mot de passe est erroné');
                alert('Le mot de passe enetré est erroné')
                window.location.reload();

            }
            setError('Failed to update client data');
            alert('Aucune donnée entrée')
            window.location.reload();
            console.error('Error updating client data:', error);
        }
    };


    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <Header />
            <div className='client-info-body'>
            <div className='client-cf-screen__content'>
                            <div className="client-cf-screen__background">
                                <span className="client-cf-screen__background__shape client-cf-screen__background__shape4"></span>
                                <span className="client-cf-screen__background__shape client-products-screen__background__shape6"></span>
                                <span className="client-cf-screen__background__shape client-cf-screen__background__shape5"></span>
                                <span className="client-cf-screen__background__shape client-cf-screen__background__shape3"></span>
                                <span className="client-cf-screen__background__shape client-cf-screen__background__shape2"></span>
                                <span className="client-cf-screen__background__shape client-cf-screen__background__shape1"></span>
                            </div>
            <Container className='client-info-container'>
            
                <Row className="justify-content-md-center">
                    <Col md="8">
                        <Card className='client-info-card'>
                        
                            <Card.Header>Client Information</Card.Header>
                            <Card.Body>
                            <div className='client-cf-screen__content'>

                                {client ? (
                                    editMode ? (
                                        <Form>
                                            <Form.Group controlId="formEmail">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group controlId="formAdresse">
                                                <Form.Label>Adresse</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={adresse}
                                                    onChange={(e) => setAdresse(e.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group controlId="formCurrentPassword">
                                                <Form.Label>Current Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group controlId="formNewPassword">
                                                <Form.Label>New Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                />
                                            </Form.Group>
                                            <div className='client-save-cancel-info'>
                                            <Button className='Save-info-button'onClick={handleSave}>
                                                Save
                                            </Button>{' '}
                                            <Button variant="secondary" onClick={handleCancel}>
                                                Cancel
                                            </Button>
                                        </div>
                                        </Form>
                                    ) : (
                                        <>
                                            <div className='client-info-titre'>{client.prenom} {client.nom}</div>
                                            <Card.Text>
                                                <strong>Email:</strong> {client.email}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Adresse:</strong> {client.adresse}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Created At:</strong> {moment(client.createdAt).format('DD/MM/YYYY')}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Updated At:</strong> {moment(client.updatedAt).format('DD/MM/YYYY')}
                                            </Card.Text>
                                            <div className='info-edit-button'>
                                            <Button className='Edit-info-button' onClick={handleEdit}>Edit</Button>
                                            </div>
                                        </>
                                    )
                                ) : (
                                    <p>Loading client data...</p>
                                )}
                                </div>
                            </Card.Body>
                            
                        </Card>
                    </Col>
                </Row>
                
            </Container>
            </div>
            </div>
            <SideNav />
            <Footer />
        </div>
    );
};

export default ClientInfo;
