import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideNav from '../components/SideNav';
import '../css/AdminInfo.css';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const AdminInfo = () => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                setLoading(false);
            }
        };

        const fetchAdmin = async (userId) => {
            try {
                const response = await axios.get(`http://localhost:3001/admin/find/${userId}`);
                setAdmin(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch admin data');
                console.error('Error fetching admin data:', error);
                setLoading(false);
            }
        };

        fetchAdminId();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <Header/>
        <Container>
            <Row className="justify-content-md-center">
                <Col md="8">
                    <Card>
                        <Card.Header>Admin Information</Card.Header>
                        <Card.Body>
                            {admin ? (
                                <>
                                    <Card.Title>{admin.prenom} {admin.nom}</Card.Title>
                                    <Card.Text>
                                        <strong>Email:</strong> {admin.email}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Role:Admin</strong> {admin.role}
                                    </Card.Text>
                                    <Button variant="primary">Edit</Button>
                                </>
                            ) : (
                                <p>Admin not found</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
        <SideNav/>
        <Footer/>
        </div>
    );
};

export default AdminInfo;
