import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Header2 from '../components/Header2';
import Footer2 from '../components/Footer2';
import SideNav2 from '../components/SideNav2';
import UseAuth from '../hooks/UseAuth';
import UseProductManager from '../hooks/UseProductManager';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';

const ProductManagerInfo = () => {
    const [admin, setAdmin] = useState(null);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [email, setEmail] = useState('');
    const [adresse, setAdresse] = useState('');
    const [role,setRole] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const isAuthenticated = UseAuth();
    const { isProductManager, loading } = UseProductManager();

    useEffect(() => {
        const fetchAdminId = async () => {
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
                fetchAdmin(userId);
            } catch (error) {
                setError('Failed to fetch admin ID');
                console.error('Error fetching admin ID:', error);
            }
        };

        const fetchAdmin = async (userId) => {
            try {
                const response = await axios.get(`http://localhost:3001/admin/find/${userId}`);
                setAdmin(response.data);
                setEmail(response.data.email);
                setAdresse(response.data.adresse);
                setRole(response.data.role);
            } catch (error) {
                setError('Failed to fetch admin data');
                console.error('Error fetching admin data:', error);
            }
        };

        fetchAdminId();
    }, []);

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleCancel = () => {
        setEditMode(false);
        setEmail(admin.email);
        setAdresse(admin.adresse);
        setCurrentPassword('');
        setNewPassword('');
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:3001/admin/changer/${admin.id}`, {
                email,
                adresse,
                currentPassword,
                newPassword
            });
            setAdmin({ ...admin, email, adresse });
            setEditMode(false);
        } catch (error) {
            if (error.response && error.response.status === 401){
                setError('Le mot de passe est erroné');
                alert('Le mot de passe enetré est erroné')
                window.location.reload();

            }
            setError('Failed to update admin data');
            console.error('Error updating admin data:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!isProductManager) {
        return <p>You do not have access to this section.</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <Header2 />
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
                            <Card.Header>Admin Information</Card.Header>
                            <Card.Body>
                                {admin ? (
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
                                            <Button variant="primary" onClick={handleSave}>
                                                Save
                                            </Button>{' '}
                                            <Button variant="secondary" onClick={handleCancel}>
                                                Cancel
                                            </Button>
                                        </Form>
                                    ) : (
                                        <>
                                            <Card.Title>{admin.prenom} {admin.nom}</Card.Title>
                                            <Card.Text>
                                                <strong>Email:</strong> {admin.email}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Role:</strong> {admin.role}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Adresse:</strong> {admin.adresse}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Created At:</strong> {moment(admin.createdAt).format('DD/MM/YYYY')}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Updated At:</strong> {moment(admin.updatedAt).format('DD/MM/YYYY')}
                                            </Card.Text>
                                            <Button variant="primary" onClick={handleEdit}>Edit</Button>
                                        </>
                                    )
                                ) : (
                                    <p>Loading admin data...</p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            </div>
            </div>
            <SideNav2 />
            <Footer2 />
        </div>
    );
};

export default ProductManagerInfo;
