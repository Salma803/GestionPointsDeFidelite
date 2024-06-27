const express = require('express');
const router = express.Router();
const { Rayon,PromotionRayon} = require('../models'); 

router.post('/creerrayon', async (req, res) => {
    const { nom,  valeur_promotion ,date_debut, date_fin } = req.body;
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
        if (!nom ) {
            return res.status(400).json({ error: 'Le nom du rayon sont requis' });
        }

        // Check if ean1 is unique
        const existingRayon = await Rayon.findOne({ where: { nom } });
        if (existingRayon) {
            return res.status(400).json({ error: 'Le nom doit être unique' });
        }

        // Check if ean2 is unique if provided
        // Create the new product
        const newRayon = await Rayon.create({
            nom
        });

        // Create promotion produit with default or provided value
        await PromotionRayon.create({
            id_rayon: newRayon.id,
            valeur: promotionValue,
            date_debut: startDate,
            date_fin: finishDate
        });

        // Return the newly created product as JSON response
        res.status(201).json(newRayon);

    } catch (error) {
        console.error('Erreur lors de la création du rayon :', error);
        res.status(500).json({ error: 'Échec de la création du rayon' });
    }
});



module.exports = router;
