import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideNav from '../components/SideNav';
import Home from '../components/Home'
import '../css/ListeChequesCadeau.css';
import UseAuth from '../hooks/UseAuth';

const ListeChequesCadeau = () => {
    const [cheques, setCheques] = useState([]);
    const [filteredCheques, setFilteredCheques] = useState([]);
    const [sortOrder, setSortOrder] = useState('ASC');
    const [selectedCheque, setSelectedCheque] = useState(null);
    const [newStatut, setNewStatut] = useState('');
    const [newDateExpiration, setNewDateExpiration] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState('');
    const isAuthenticated = UseAuth();

    useEffect(() => {
        fetchChequeCadeaux();
    }, []);

    const fetchChequeCadeaux = async () => {
        try {
            const response = await axios.get('http://localhost:3001/chequecadeau');
            setCheques(response.data);
            setFilteredCheques(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des chéques cadeaux:', error);
        }
    };

    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        filterCheques(query);
    };

    const handleSearchIconClick = () => {
        filterCheques(searchQuery);
    };

    const filterCheques = (query) => {
        if (!query) {
            setFilteredCheques(cheques);
            return;
        }

        const filtered = cheques.filter(cheque => 
            cheque.statut.toLowerCase().includes(query) ||
            cheque.code.toLowerCase().includes(query) ||
            cheque.date_expiration.toLowerCase().includes(query) ||
            cheque.Client?.nom.toLowerCase().includes(query) ||
            cheque.Client?.prenom.toLowerCase().includes(query) ||
            cheque.Client?.email.toLowerCase().includes(query) ||
            cheque.Client?.telephone.toLowerCase().includes(query)
        );

        setFilteredCheques(filtered);
    };

    const handleStatutChange = (e) => {
        setNewStatut(e.target.value);
    };

    const handleDateChange = (date) => {
        setNewDateExpiration(date);
    };

    const handleUpdate = async (id) => {
        try {
            const response = await axios.put(`http://localhost:3001/chequecadeau/${id}`, {
                statut: newStatut,
                date_expiration: newDateExpiration
            });

            const updatedCheque = response.data;
            setCheques(cheques.map(item => item.id === id ? updatedCheque : item));
            setFilteredCheques(filteredCheques.map(item => item.id === id ? updatedCheque : item));
            setSelectedCheque(null);
            window.location.reload();
        } catch (error) {
            console.error('Erreur lors de la mise à jour du chéque cadeau:', error);
        }
    };

    const handleSort = () => {
        const sortedData = [...filteredCheques].sort((a, b) => {
            if (sortOrder === 'ASC') {
                return new Date(a.date_expiration) - new Date(b.date_expiration);
            } else {
                return new Date(b.date_expiration) - new Date(a.date_expiration);
            }
        });
        setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
        setFilteredCheques(sortedData);
    };

    const deleteCheque = async (chequeId) => {
        try {
            await axios.delete(`http://localhost:3001/chequecadeau/${chequeId}`);
            setCheques(cheques.filter(cheque => cheque.id !== chequeId));
            setFilteredCheques(filteredCheques.filter(cheque => cheque.id !== chequeId));
            console.log('cheque deleted successfully');
        } catch (error) {
            console.error('Error deleting cheque:', error);
        }
    };

    return (
        <div>
            <Header/>
            <Home/>
            <div className="container">
                <div className="search-container">
                    <input
                        className="search-input"
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search cheques by name, email, or telephone"
                    />
                    <FontAwesomeIcon 
                        icon={faSearch} 
                        onClick={handleSearchIconClick} 
                        className="search-icon" 
                    />
                </div>
                <button onClick={handleSort} className="sort-button">Sort by Date d'Expiration</button>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID chéque</th>
                            <th>Code Carte</th>
                            <th>Statut</th>
                            <th>Date d'Expiration</th>
                            <th>Nom du client</th>
                            <th>Prénom du client</th>
                            <th>Email</th>
                            <th>Téléphone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCheques.map((cheque, index) => (
                            <tr key={cheque.id}>
                                <td>{cheque.id}</td>
                                <td>{cheque.code}</td>
                                <td>
                                    {selectedCheque === cheque.id ? (
                                        <select value={newStatut} onChange={handleStatutChange}>
                                            <option value="valide">Valide</option>
                                            <option value="consommé">Consommé</option>
                                            <option value="expiré">Expiré</option>
                                        </select>
                                    ) : cheque.statut}
                                </td>
                                <td>
                                    {selectedCheque === cheque.id ? (
                                        <DatePicker
                                            selected={newDateExpiration}
                                            onChange={handleDateChange}
                                            dateFormat="yyyy-MM-dd"
                                        />
                                    ) : new Date(cheque.date_expiration).toLocaleDateString()}
                                </td>
                                <td>{cheque.Client?.nom}</td>
                                <td>{cheque.Client?.prenom}</td>
                                <td>{cheque.Client?.email}</td>
                                <td>{cheque.Client?.telephone}</td>
                                <td>
                                    {selectedCheque === cheque.id ? (
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            className="save-icon"
                                            onClick={() => handleUpdate(cheque.id)}
                                        />
                                    ) : (
                                        <>
                                            <FontAwesomeIcon
                                                icon={faEdit}
                                                className="edit-icon"
                                                onClick={() => {
                                                    setSelectedCheque(cheque.id);
                                                    setNewStatut(cheque.statut);
                                                    setNewDateExpiration(new Date(cheque.date_expiration));
                                                }}
                                            />
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                className="delete-icon"
                                                style={{ color: "#ed0c0c" }}
                                                onClick={() => deleteCheque(cheque.id)}
                                            />
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <SideNav/>
            <Footer/>
        </div>
    );
};

export default ListeChequesCadeau;
