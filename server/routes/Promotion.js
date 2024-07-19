const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const { PromotionProduit, PromotionRayon, Produit, Rayon } = require('../models');

// Voir si un produit est en promotion rayon ou produit puis retourner un boolean true or false et la valeur de la promotion
router.get('/:idProduit', async (req, res) => {
    try {
        const { idProduit } = req.params;
        
        // Fetch the product
        const produit = await Produit.findByPk(idProduit);
        if (!produit) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        const promotionProduit = await PromotionProduit.findOne({
            where: {
                id_produit: idProduit,
                valeur: {
                    [sequelize.Op.ne]: 0
                }
            }
        });

        const idRayon = produit.id_rayon;

        const promotionRayon = await PromotionRayon.findOne({
            where: {
                id_rayon: idRayon,
                valeur: {
                    [sequelize.Op.ne]: 0
                }
            }
        });

        let estSolde = false;
        let valeurSolde = 0;

        if (promotionProduit || promotionRayon) {
            estSolde = true;
            if (promotionRayon && promotionProduit) {
                valeurSolde = promotionRayon.valeur;
            } else if (promotionRayon) {
                valeurSolde = promotionRayon.valeur;
            } else if (promotionProduit) {
                valeurSolde = promotionProduit.valeur;
            }
        }

        res.status(200).json({ idProduit,estSolde, valeurSolde });
    } catch (error) {
        console.error('Erreur lors de la recherche de la promotion du produit:', error);
        res.status(500).json({ error: 'Erreur lors de la recherche de la promotion du produit' });
    }
});

//Modifier la promotion d'un rayon a l'aide de son nom
router.put('/rayon/:idrayon', async (req, res) => {
    const { idrayon } = req.params;
    const { valeur_promotion, date_debut, date_fin } = req.body;

    try {
        // Check if the rayon exists
        const rayon = await Rayon.findOne({ where: { id: idrayon } });
        if (!rayon) {
            return res.status(404).json({ error: 'Rayon non trouvé' });
        }

        // Check if there is an existing promotion for this rayon
        const promotionRayon = await PromotionRayon.findOne({ where: { id_rayon: idrayon } });
        if (!promotionRayon) {
            return res.status(404).json({ error: 'Promotion pour ce rayon non trouvée' });
        }

        // Prepare the updated values
        const newValeur = valeur_promotion !== undefined ? valeur_promotion : promotionRayon.valeur;
        const newDateDebut = date_debut ? new Date(date_debut) : promotionRayon.date_debut;
        const newDateFin = date_fin ? new Date(date_fin) : promotionRayon.date_fin;

        // Check if the date_debut is less than the date_fin
        if (newDateDebut >= newDateFin) {
            return res.status(400).json({ error: 'La date de début doit être inférieure à la date de fin' });
        }

        // Update the promotion values
        promotionRayon.valeur = newValeur;
        promotionRayon.date_debut = newDateDebut;
        promotionRayon.date_fin = newDateFin;

        // Save the updated promotion
        await promotionRayon.save();

        // Return the updated promotion as JSON response
        res.status(200).json(promotionRayon);

    } catch (error) {
        console.error('Erreur lors de la mise à jour de la promotion du rayon :', error);
        res.status(500).json({ error: 'Échec de la mise à jour de la promotion du rayon' });
    }
});





//Mis a jour de la valeur de promotion ou des date de Promotion a l'aide de l'ean1 d'un produit
router.put('/produit/:idproduit', async (req, res) => {
    const { idproduit } = req.params;
    const { valeur_promotion, date_debut, date_fin } = req.body;

    try {
        // Check if the product exists
        const produit = await Produit.findOne({ where: { id: idproduit } });
        if (!produit) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        // Check if there is an existing promotion for this product
        const promotionProduit = await PromotionProduit.findOne({ where: { id_produit: idproduit } });
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



// Combined method for updating promotion for rayon or produit
router.put('/', async (req, res) => {
    const { type, idRayon, idProduit } = req.body; // 'type' can be 'rayon' or 'produit'
    const { valeur_promotion, date_debut, date_fin } = req.body;

    try {
        let promotionEntity;
        let entityModel;

        if (type === 'rayon') {
            // Validate input
            if (!idRayon || valeur_promotion === undefined || typeof valeur_promotion !== 'number') {
                return res.status(400).json({ error: 'ID du rayon et la nouvelle valeur de promotion sont requises et doivent être valides' });
            }

            // Check if the rayon exists
            const rayon = await Rayon.findOne({ where: { id: idRayon } });
            if (!rayon) {
                return res.status(404).json({ error: 'Rayon non trouvé' });
            }

            // Check if there is an existing promotion for this rayon
            promotionEntity = await PromotionRayon.findOne({ where: { id: idRayon } });
            entityModel = PromotionRayon;
        } else if (type === 'produit') {
            // Validate input
            if (!idProduit || valeur_promotion === undefined) {
                return res.status(400).json({ error: 'ID du produit et la nouvelle valeur de promotion sont requises' });
            }

            // Check if the product exists
            const produit = await Produit.findOne({ where: { id: idProduit } });
            if (!produit) {
                return res.status(404).json({ error: 'Produit non trouvé' });
            }

            // Check if there is an existing promotion for this product
            promotionEntity = await PromotionProduit.findOne({ where: { id_produit: idProduit } });
            entityModel = PromotionProduit;
        } else {
            return res.status(400).json({ error: 'Type de promotion invalide' });
        }

        // Prepare the updated values
        const newValeur = valeur_promotion !== undefined ? valeur_promotion : promotionEntity.valeur;
        const newDateDebut = date_debut ? new Date(date_debut) : promotionEntity.date_debut;
        const newDateFin = date_fin ? new Date(date_fin) : promotionEntity.date_fin;

        // Check if the date_debut is less than the date_fin
        if (newDateDebut >= newDateFin) {
            return res.status(400).json({ error: 'La date de début doit être inférieure à la date de fin' });
        }

        // Update the promotion values
        promotionEntity.valeur = newValeur;
        promotionEntity.date_debut = newDateDebut;
        promotionEntity.date_fin = newDateFin;

        // Save the updated promotion
        await promotionEntity.save();

        // Return the updated promotion as JSON response
        res.status(200).json(promotionEntity);

    } catch (error) {
        console.error(`Erreur lors de la mise à jour de la promotion du ${type} :`, error);
        res.status(500).json({ error: `Échec de la mise à jour de la promotion du ${type}` });
    }
});


module.exports = router;
