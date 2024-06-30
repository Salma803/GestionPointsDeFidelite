const express = require('express');
const router = express.Router();
const { Detail,Achat } = require('../models');


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

        const mappedDetails = details.map(detail => ({
            id: detail.id,
            quantite: detail.quantite,
            point: detail.point,
            total : detail.total
            // Include other fields you want to send in the response
        }));

        res.json(mappedDetails);
    } catch (error) {
        console.error('Error fetching details:', error);
        res.status(500).json({ error: 'Failed to fetch details' });
    }
});

module.exports = router;
