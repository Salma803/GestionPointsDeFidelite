const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const { Produit,Rayon,PromotionProduit } = require('../models'); 
const { where } = require('sequelize');



router.post('/creerproduits', async (req, res) => {
    const { nom, description, ean1, ean2, prix, id_rayon, valeur_promotion, date_debut,date_fin } = req.body;
    const promotionValue = valeur_promotion !== undefined ? valeur_promotion : 0;
    const startDate = date_debut ? new Date(date_debut) : new Date();
    let finishDate;
        
        if (date_fin) {
            finishDate = new Date(date_fin);
        } else {
            finishDate = new Date(startDate);
            finishDate.setMonth(finishDate.getMonth() + 1);
        }

        if (finishDate <= startDate) {
            return res.status(400).json({ error: 'La date de fin doit être supérieure à la date de début' });
        }
    try {
        // Validate input
        if (!nom || !ean1 || !prix || !id_rayon) {
            return res.status(400).json({ error: 'Le nom, l\'ean1, le prix et l\'ID du produit sont requis' });
        }

        // Check if ean1 is unique
        const existingProduit = await Produit.findOne({ where: { ean1 } });
        if (existingProduit) {
            return res.status(400).json({ error: 'L\'ean1 doit être unique' });
        }

        // Check if ean2 is unique if provided
        if (ean2) {
            const existingProduitWithEan2 = await Produit.findOne({ where: { ean2 } });
            if (existingProduitWithEan2) {
                return res.status(400).json({ error: 'L\'ean2 doit être unique' });
            }
        }

        // Create the new product
        const newProduit = await Produit.create({
            nom, description, ean1, ean2, prix, id_rayon
        });

        // Create promotion produit with default or provided value
        await PromotionProduit.create({
            id_produit: newProduit.id,
            valeur: promotionValue,
            date_debut: startDate,
            date_fin: finishDate
        });

        // Return the newly created product as JSON response
        res.status(201).json(newProduit);

    } catch (error) {
        console.error('Erreur lors de la création du produit :', error);
        res.status(500).json({ error: 'Échec de la création du produit' });
    }
});

//Mis a jour de la valeur de promotion ou de la date de
router.put('/updatePromotion', async (req, res) => {
    const { ean1, valeur_promotion, date_debut, date_fin } = req.body;
    
    try {
        // Validate input
        if (!ean1 || valeur_promotion === undefined) {
            return res.status(400).json({ error: 'L\'ean1 et la nouvelle valeur de promotion sont requis' });
        }

        // Check if the product exists
        const produit = await Produit.findOne({ where: { ean1 } });
        if (!produit) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        // Check if there is an existing promotion for this product
        const promotionProduit = await PromotionProduit.findOne({ where: { id_produit: produit.id } });
        if (!promotionProduit) {
            return res.status(404).json({ error: 'Promotion pour ce produit non trouvée' });
        }

        // Prepare the updated values
        const newValeur = valeur_promotion !== undefined ? valeur_promotion : promotionProduit.valeur;
        const newDateDebut = date_debut ? new Date(date_debut) : promotionProduit.date_debut;
        const newDateFin = date_fin ? new Date(date_fin) : promotionProduit.date_fin;

        // Check if the date_debut is less than the date_fin
        if (newDateDebut >= newDateFin) {
            return res.status(400).json({ error: 'La date de début doit être inférieure à la date de fin' });
        }

        // Update the promotion values
        promotionProduit.valeur = newValeur;
        promotionProduit.date_debut = newDateDebut;
        promotionProduit.date_fin = newDateFin;

        // Save the updated promotion
        await promotionProduit.save();

        // Return the updated promotion as JSON response
        res.status(200).json(promotionProduit);

    } catch (error) {
        console.error('Erreur lors de la mise à jour de la promotion du produit :', error);
        res.status(500).json({ error: 'Échec de la mise à jour de la promotion du produit' });
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
router.get('trouver/:idProduit', async (req, res) => {
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

//Voir le prix d'un produit apres le solde 
router.get('/prixsolde', async (req, res) => {
    try {
        const { idProduit,estSolde, valeurSolde } = req.body;
        
        // Trouver le produit par ID
        const produit = await Produit.findByPk(idProduit);
        if (!produit) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        const prixAvantSolde = produit.prix;
        let prixApresSolde;

        // Calculer le prix après solde
        if (estSolde === true) {
            prixApresSolde = prixAvantSolde - (prixAvantSolde * (valeurSolde / 100));
        } else {
            prixApresSolde = prixAvantSolde;
        }

        // Retourner les informations comme JSON
        res.status(200).json({ 
            idProduit, 
            valeurSolde, 
            prixAvantSolde, 
            prixApresSolde 
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du prix après solde :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du prix après solde' });
    }
});



module.exports = router;