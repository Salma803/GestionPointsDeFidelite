const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const { Produit,Rayon } = require('../models'); 
const { where } = require('sequelize');

router.post('/creerproduits', async (req, res) => {
    const { nom, description, ean1,ean2,prix,id_rayon,
		id_promotion} = req.body;

    try {
        // Validate input
        if (!nom || !ean1 || !prix ) {
            return res.status(400).json({ error: 'Le nom, lean1,le prix et id du rayon sont requise' });
        }

     
        // Create the new client
        const newProduit = await Produit.create({
            nom, description, ean1,ean2,prix,id_rayon,id_rayon
        });

        // Return the newly created client as JSON response
        res.status(201).json(newProduit);

    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

//voir tous les produits
router.get('/produits', async (req, res) => {
    try {
        const listeProduits= await Produit.findAll();
        res.json(listeProduits);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json('Failed to fetch clients');
    }
});

//voir un produit spécifique par id
router.get('/:idProduit', async (req, res) => {
    const { idProduit } = req.params; // Extracting idProduit from URL parameters

    try {
        const produit = await Produit.findByPk(idProduit); // Fetch product by primary key
        if (!produit) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(produit);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json('Failed to fetch product');
    }
});
//Voir les produits par rayon

router.get('/rayon/:idRayon', async (req, res) => {
    const { idRayon } = req.params; // Extraction de idRayon depuis les paramètres d'URL

    try {
        const produits = await Produit.findAll({
            include: [{
                model: Rayon,
                attributes: ['nom'], // Spécifiez les attributs à inclure depuis le modèle Rayon
                where: { id: idRayon } // Filtrer par l'id du rayon
            }]
        });

        // Vérifiez si des produits ont été trouvés
        if (produits.length === 0) {
            return res.status(404).json({ error: 'Aucun produit trouvé pour ce rayon' });
        }

        // Retournez les produits trouvés en réponse JSON
        res.json(produits);
    } catch (error) {
        console.error('Error fetching products by rayon ID:', error);
        res.status(500).json({ error: 'Échec de la récupération des produits' });
    }
});

module.exports = router;


module.exports = router;