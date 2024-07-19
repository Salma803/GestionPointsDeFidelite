import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Form, Button } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideNav from '../components/SideNav';
import '../css/ReclamationsAdmin.css';
import UseAuth from '../hooks/UseAuth';
import UseLoyaltyManager from '../hooks/UseLoyaltyManager';

const ReclamationsAdmin = () => {
    const [reclamations, setReclamations] = useState([]);
    const [réponse, setReponse] = useState('');
    const [updatingReclamationId, setUpdatingReclamationId] = useState(null);
    const isAuthenticated = UseAuth();
    const { isLoyaltyManager, loading } = UseLoyaltyManager();

    // Function to fetch reclamations from server
    const fetchReclamations = async () => {
        try {
            const response = await axios.get('http://localhost:3001/reclamation');
            setReclamations(response.data);
        } catch (error) {
            console.error('Error fetching reclamations:', error);
        }
    };

    // Load reclamations on component mount
    useEffect(() => {
        fetchReclamations();
    }, []);

    // Function to handle updating reclamation réponse
    const handleUpdateReclamation = async (idReclamation) => {
        try {
            await axios.put(`http://localhost:3001/reclamation/${idReclamation}`, { réponse });
            // Update the local state with the updated reclamation
            setReclamations(reclamations.map(reclamation =>
                reclamation.id === idReclamation ? { ...reclamation, réponse } : reclamation
            ));
            // Reset the réponse state
            setReponse('');
            // Reset the updatingReclamationId state
            setUpdatingReclamationId(null);
        } catch (error) {
            console.error('Error updating reclamation réponse:', error);
        }
    };

    // Function to handle updating the réponse state
    const handleChangeReponse = (event) => {
        setReponse(event.target.value);
    };

    // Function to start updating réponse for a reclamation
    const startUpdatingReclamation = (idReclamation) => {
        setUpdatingReclamationId(idReclamation);
        // Fetch the current réponse to prefill the input field
        const reclamationToUpdate = reclamations.find(reclamation => reclamation.id === idReclamation);
        if (reclamationToUpdate) {
            setReponse(reclamationToUpdate.réponse || '');
        }
    };

    // Function to handle marking reclamation as traité
    const handleMarkAsTraité = async (idReclamation) => {
        try {
            await axios.put(`http://localhost:3001/reclamation/${idReclamation}`, { statut: 'traité' });
            // Update the local state to mark the reclamation as traité
            setReclamations(reclamations.map(reclamation =>
                reclamation.id === idReclamation ? { ...reclamation, statut: 'traité' } : reclamation
            ));
        } catch (error) {
            console.error('Error marking reclamation as traité:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isLoyaltyManager) {
        return <p>You do not have access to this section.</p>;
    }

    return (
        <div>
            <Header />
            <div className="admin-produits-container">
            <div className="client-cf-screen__background">
                                    <span className="client-cf-screen__background__shape screen__background__shape4"></span>
                                    <span className="client-cf-screen__background__shape screen__background__shape3"></span>
                                    <span className="client-cf-screen__background__shape screen__background__shape2"></span>
                                    <span className="client-cf-screen__background__shape screen__background__shape1"></span>
            </div>
            <div className='client-cf-screen__content'>
                <h2>Liste des Réclamations</h2>
                {reclamations.length > 0 ? (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Objet</th>
                                <th>Contenu</th>
                                <th>Statut</th>
                                <th>Réponse</th>
                                <th>Date de création</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reclamations.map(reclamation => (
                                <tr key={reclamation.id}>
                                    <td>{reclamation.id}</td>
                                    <td>{reclamation.objet}</td>
                                    <td>{reclamation.contenu}</td>
                                    <td>{reclamation.statut}</td>
                                    <td>
                                        {updatingReclamationId === reclamation.id ? (
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                value={réponse}
                                                onChange={handleChangeReponse}
                                                disabled={reclamation.statut === 'traité'}
                                            />
                                        ) : (
                                            reclamation.réponse || 'Pas de réponse'
                                        )}
                                    </td>
                                    <td>{new Date(reclamation.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        {reclamation.statut === 'traité' ? (
                                            <div className='reclamation-bttns'>
                                            <Button variant="secondary" disabled>
                                                Traitée
                                            </Button>
                                            </div>
                                        ) : (
                                            <>
                                                {updatingReclamationId === reclamation.id ? (
                                                    <div className='reclamation-bttns'>
                                                    <Button className='reclamations-sauvegarder-bttn'
                                                    onClick={() => handleUpdateReclamation(reclamation.id)}>
                                                        Save
                                                    </Button>
                                                    </div>
                                                ) : (
                                                    <div className='reclamation-bttns'>
                                                    <Button className="reclamation-edit-bttn" onClick={() => startUpdatingReclamation(reclamation.id)}>
                                                        Éditer
                                                    </Button>
                                                    </div>
                                                )}
                                                <div className='reclamation-bttns'>
                                                <Button className="reclamation-traite-bttn" onClick={() => handleMarkAsTraité(reclamation.id)}>
                                                        Traitée?
                                                </Button>
                                                </div>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    
                ) : (
                    <p>Aucune réclamation trouvée.</p>
                )}
            </div>
            <SideNav />
            <Footer />
        </div>
        </div>
    );
};

export default ReclamationsAdmin;
