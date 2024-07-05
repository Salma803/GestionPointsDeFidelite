const express = require('express');
const router = express.Router();
const { Detail,Achat,Produit } = require('../models');


router.get('/:idClient', async (req, res) => {
    const clientId = req.params.idClient;

    try {
        const achats = await Achat.findAll({
            where: { id_client: clientId }
        });

        if (achats.length === 0) {
            return res.status(200).json('Vous n\'avez pas encore effecté d\'achat');
        }

        const mappedAchats = achats.map(achat => ({
            id: achat.id,
            point: achat.point,
            total_achat: achat.total,
            date_achat: achat.createdAt,
            
        }));

        res.json(mappedAchats);
    } catch (error) {
        console.error('Error fetching details:', error);
        res.status(500).json({ error: 'Failed to fetch details' });
    }
});


router.get('/detail/:idAchat', async (req, res) => {
    const achatId = req.params.idAchat;

    try {
        const details = await Detail.findAll({
            where: { id_achat: achatId }
        });

        if (details.length === 0) {
            return res.status(200).json('Pas de détails correspondants pour cet achat');
        }

        const mappedDetails = await Promise.all(details.map(async detail => {
            const produit = await Produit.findByPk(detail.id_produit, {
                attributes: ['nom','ean1','prix'] // Specify the fields you want to include
            });

            return {
                id: detail.id,
                id_produit: detail.id_produit,
                quantite: detail.quantite,
                point: detail.point,
                total: detail.total,
                produit: {
                    nom: produit.nom,
                    ean1: produit.ean1,
                    prix: produit.prix
                }
            };
        }));

        res.json(mappedDetails);
    } catch (error) {
        console.error('Error fetching details:', error);
        res.status(500).json({ error: 'Failed to fetch details' });
    }
});




module.exports = router;
