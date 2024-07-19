import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Footer2 from '../components/Footer2';

import SideNav2 from '../components/SideNav2';
import Header2 from '../components/Header2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCheck, faTimes, faSearch, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import UseAuth from '../hooks/UseAuth';
import UseProductManager from '../hooks/UseProductManager';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function PromotionsProduits() {
    const [produits, setProduits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingField, setEditingField] = useState(null);
    const [filteredProduits, setFilteredProduits] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortCriteria, setSortCriteria] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const { isProductManager, loading: authLoading } = UseProductManager();
    const isAuthenticated = UseAuth();

    useEffect(() => {
        fetchProduits();
    }, []);

    useEffect(() => {
        sortProduits(sortCriteria, sortOrder);
    }, [produits, sortCriteria, sortOrder]);

    const fetchProduits = async () => {
        try {
            const response = await axios.get('http://localhost:3001/produit/produitpromotion');
            console.log('Fetched data:', response.data);
            if (Array.isArray(response.data)) {
                setProduits(response.data);
                setFilteredProduits(response.data);
            } else {
                setProduits([]);
                setFilteredProduits([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching produits:', error);
            setLoading(false);
        }
    };

    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        filterProduits(query);
    };

    const filterProduits = (query) => {
        if (!query) {
            setFilteredProduits(produits);
            return;
        }

        const filtered = produits.filter(produit =>
            produit.nom.toLowerCase().includes(query) ||
            produit.ean1.includes(query)
        );

        setFilteredProduits(filtered);
    };

    const sortProduits = (criteria, order) => {
        const sorted = [...produits].sort((a, b) => {
            if (criteria === 'prix' || criteria === 'createdAt') {
                if (order === 'asc') {
                    return a[criteria] > b[criteria] ? 1 : -1;
                } else {
                    return a[criteria] < b[criteria] ? 1 : -1;
                }
            }
            return 0;
        });
        setFilteredProduits(sorted);
    };

    const handleSortChange = (criteria) => {
        setSortCriteria(criteria);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleEditField = (produitId, field) => {
        setEditingField({ produitId, field });
    };

    const handleCancelEdit = () => {
        setEditingField(null);
    };

    const handleVerifyEdit = async (produitId, field, newValue) => {
        const confirmed = window.confirm(`Are you sure to change ${field} to "${newValue}"?`);
        if (confirmed) {
            try {
                const updatedData = {};
                if (field === 'valeur_promotion') {
                    updatedData.valeur_promotion = newValue;
                } else if (field === 'date_debut') {
                    updatedData.date_debut = new Date(newValue).toISOString().split('T')[0];
                } else if (field === 'date_fin') {
                    updatedData.date_fin = newValue ? new Date(newValue).toISOString().split('T')[0] : null;
                }

                await axios.put(
                    `http://localhost:3001/promotion/produit/${produitId}`,
                    updatedData,
                    {
                        headers: {
                            accessToken: sessionStorage.getItem('accessToken'),
                        },
                    }
                );
                alert('Product information updated successfully');
                setEditingField(null);
                fetchProduits();
            } catch (error) {
                console.error("Error updating product promotion:", error);
                alert("An error occurred while updating the promotion");
            }
        }
    };

    const handleFieldChange = (event, field) => {
        const { value } = event.target;
        setProduits(prevProduits =>
            prevProduits.map(produit =>
                produit.id === editingField.produitId ? { ...produit, [field]: value } : produit
            )
        );
    };

    const handleDateChange = (date, field) => {
        setProduits(prevProduits =>
            prevProduits.map(produit =>
                produit.id === editingField.produitId ? { ...produit, [field]: date } : produit
            )
        );
    };

    const renderField = (produit, field) => {
        if (editingField && editingField.produitId === produit.id && editingField.field === field) {
            return (
                <td>
                    {field === 'date_debut' || field === 'date_fin' ? (
                        <DatePicker
                            selected={produit[field] ? new Date(produit[field]) : null}
                            onChange={(date) => handleDateChange(date, field)}
                            dateFormat="yyyy-MM-dd"
                        />
                    ) : (
                        <input
                            type="text"
                            value={produit[field]}
                            onChange={(e) => handleFieldChange(e, field)}
                        />
                    )}
                    <FontAwesomeIcon
                        icon={faCheck}
                        className="edit-icon"
                        onClick={() => handleVerifyEdit(produit.id, field, produit[field])}
                    />
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="edit-icon"
                        onClick={handleCancelEdit}
                    />
                </td>
            );
        } else {
            return (
                <td>
                    {field === 'date_debut' || field === 'date_fin' ? (
                        produit[field] ? new Date(produit[field]).toLocaleDateString() : ''
                    ) : (
                        produit[field]
                    )}
                    <FontAwesomeIcon
                        icon={faEdit}
                        className="edit-icon"
                        onClick={() => handleEditField(produit.id, field)}
                    />
                </td>
            );
        }
    };

    if (loading || authLoading) {
        return <div>Loading...</div>;
    }

    if (!isProductManager) {
        return <p>You do not have access to this section.</p>;
    }

    return (
        <div>
            <Header2 />
            <div className="admin-produits-container">
            <div className="client-cf-screen__background">
                                    <span className="client-cf-screen__background__shape screen__background__shape4"></span>
                                    <span className="client-cf-screen__background__shape screen__background__shape3"></span>
                                    <span className="client-cf-screen__background__shape screen__background__shape2"></span>
                                    <span className="client-cf-screen__background__shape screen__background__shape1"></span>
            </div>
            <div className='client-cf-screen__content'>
                <h2>Liste de promotions produit:</h2>
                <div className="search-container">
                    <input
                        className="search-input"
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search products by name or ean1"
                    />
                    <FontAwesomeIcon
                        icon={faSearch}
                        className="search-icon"
                    />
                </div>
                <div className="sort-buttons">
                    <button onClick={() => handleSortChange('prix')}>
                        Sort by Price
                        {sortCriteria === 'prix' && (
                            <FontAwesomeIcon icon={sortOrder === 'asc' ? faSortUp : faSortDown} />
                        )}
                    </button>
                    <button onClick={() => handleSortChange('createdAt')}>
                        Sort by Creation Date
                        {sortCriteria === 'createdAt' && (
                            <FontAwesomeIcon icon={sortOrder === 'asc' ? faSortUp : faSortDown} />
                        )}
                    </button>
                </div>
                <Table className="table" striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nom</th>
                            <th>EAN1</th>
                            <th>Prix</th>
                            <th>Prix Avant Solde</th>
                            <th>Prix Après Solde</th>
                            <th>Valeur Promotion</th>
                            <th>Active Promotion</th>
                            <th>Date de début promo</th>
                            <th>Date de fin promo</th>
                            <th>Créé le:</th>
                            <th>Dernière modification</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProduits.length === 0 ? (
                            <tr>
                                <td colSpan="12" className="no-produits-message">No products found</td>
                            </tr>
                        ) : (
                            filteredProduits.map((produit, index) => (
                                <tr key={produit.id}>
                                    <td>{index + 1}</td>
                                    <td>{produit.nom}</td>
                                    <td>{produit.ean1}</td>
                                    <td>{produit.prix}</td>
                                    <td>{produit.prixAvantSolde}</td>
                                    <td>{produit.prixApresSolde}</td>
                                    {renderField(produit, 'valeur_promotion')}
                                    <td>{produit.active ? 'Yes' : 'No'}</td>
                                    {renderField(produit, 'date_debut')}
                                    {renderField(produit, 'date_fin')}
                                    <td>{new Date(produit.createdAt).toLocaleDateString()}</td>
                                    <td>{new Date(produit.updatedAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
                </div>
            </div>
            <SideNav2 />
            <Footer2/>
        </div>
    );
}

export default PromotionsProduits;
