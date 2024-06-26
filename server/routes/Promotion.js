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

module.exports = router;
