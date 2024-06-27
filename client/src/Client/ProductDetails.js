import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ProductDetails.css'

function ProductDetails() {
    const { id } = useParams(); // Get the product ID from the URL
    const [produit, setProduit] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3001/produit/${id}`)
            .then((response) => {
                setProduit(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(`Error fetching product ${id}:`, error);
                setError('Failed to fetch product details');
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div>Loading...</div>; // Display a loading indicator while fetching data
    }

    if (error) {
        return <div>Error: {error}</div>; // Display an error message if fetching fails
    }

    return (
        <div>
            <Link to="/client/home" className="backButton">
                Accueil
            </Link>
            <div className="ProduitDiv">
                <div className="produit"><strong>Nom du produit :</strong> {produit.nom}</div>
                <div className="produit"><strong>Description du produit :</strong> {produit.description}</div>
                <div className="produit"><strong>Code Produit :</strong> {produit.ean1}</div>
                {produit.active ? (
                    <>
                        <div className="prixOriginal"><strong>Prix Original :</strong> {produit.prixAvantSolde} DH</div>
                        <div className="promotion"><strong>Promotion :</strong> {produit.valeurSolde}%</div>
                        <div className="prixSolde"><strong>Prix Actuel :</strong> {produit.prixApresSolde} DH</div>
                        <div className="dateFin"><strong>Date de Fin de Promotion :</strong> {new Date(produit.dateFinPromo).toLocaleDateString()}</div>
                    </>
                ) : (
                    <div className="prix"><strong>Prix :</strong> {produit.prix} DH</div>
                )}
            </div>
        </div>
    );
}

export default ProductDetails;
