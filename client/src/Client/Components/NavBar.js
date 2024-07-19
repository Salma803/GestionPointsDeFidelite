import React from 'react';
import axios from 'axios';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Gift, ShoppingCart,House, IdentificationCard, Storefront, User, Receipt } from 'phosphor-react';
import '../css/Navbar.css';

const NavBar = () => {
    const navigate = useNavigate();

    const updateLoyaltyCard = async () => {
        try {
            const response = await fetch('http://localhost:3001/client/me', {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken")
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const userData = await response.json();
            const userId = userData.userId;

            // Update loyalty card on backend
            await axios.post(`http://localhost:3001/cartefidelite/${userId}`);
            navigate('/cartefidelite');
        } catch (error) {
            console.error('Error updating loyalty card:', error);
        }
    };

    const logout = () => {
        sessionStorage.removeItem('accessToken');
        navigate('/client');
    };

    // Navigation functions
    const navigateHome = () => {
        navigate('/client/magasin');
    };
    const navigatePanier = () => {
        navigate('/panier');
    };

    const navigateAchat = () => {
        navigate('/achat');
    };

    return (
        <Navbar variant="light" bg="light" expand="lg">
            <Container className='NavBar-container' fluid>
                <Navbar.Brand onClick={navigateHome}>
                    <img className='icon-img'
                        src={process.env.PUBLIC_URL + '/Logo.png'} 
                        alt="Your Icon"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-dark-example" />
                <Navbar.Collapse id="navbar-dark-example">
                    <Nav className="me-auto">
                    <Nav.Link onClick={updateLoyaltyCard}><House size={32} color="#3c43af" /></Nav.Link>
                        <Nav.Link onClick={navigateHome}><Storefront size={32} color="#3c43af" /></Nav.Link>
                        <Nav.Link onClick={navigatePanier}><ShoppingCart size={32} color="#3c43af" /></Nav.Link>
                        <Nav.Link onClick={navigateAchat}><Receipt size={32} color='#3C43AF' /></Nav.Link>
                        <NavDropdown id="nav-dropdown-dark-example" menuVariant="light" title={<User size={24} color="#3c43af" />}>
                            <NavDropdown.Item onClick={logout}>Se Déconnecter</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Mes infos</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Changer le mot de passe</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/client/reclamations">Mes réclamations</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
