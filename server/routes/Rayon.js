const express = require('express');
const router = express.Router();
const { Rayon,PromotionRayon,Regle} = require('../models');
const {Op } = require('sequelize');
const moment = require('moment');


router.post('/creerrayon', async (req, res) => {
    const { nom, valeur_promotion, date_debut, date_fin } = req.body;
    const promotionValue = valeur_promotion !== undefined && valeur_promotion !== '' ? valeur_promotion : 0;
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
        if (!nom) {
            return res.status(400).json({ error: 'Le nom du rayon est requis' });
        }

        // Check if nom is unique
        const existingRayon = await Rayon.findOne({ where: { nom } });
        if (existingRayon) {
            return res.status(401).json({ error: 'Le nom doit être unique' });
        }

        // Create the new rayon
        const newRayon = await Rayon.create({ nom });

        // Create promotion rayon with default or provided value
        await PromotionRayon.create({
            id_rayon: newRayon.id,
            valeur: promotionValue,
            date_debut: startDate,
            date_fin: finishDate
        });

        // Create Regle with id_rayon and multiplicite of 1
        await Regle.create({
            id_rayon: newRayon.id,
            multiplicite: 1,
            date_debut: startDate,
            date_fin: finishDate
        });

        // Return the newly created rayon as JSON response
        res.status(201).json(newRayon);

    } catch (error) {
        console.error('Erreur lors de la création du rayon :', error.message);
        res.status(500).json({ error: 'Échec de la création du rayon', details: error.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const listeRayons = await Rayon.findAll();

        if (listeRayons.length === 0) {
            return res.status(404).json({ error: 'Aucun Rayon trouvé dans la table Rayon' });
        }

        const formattedRayons = listeRayons.map(rayon => ({
            ...rayon.dataValues,
            createdAt: moment(rayon.createdAt).format('DD-MM-YYYY'),
            updatedAt: moment(rayon.updatedAt).format('DD-MM-YYYY'),
        }));

        res.json(formattedRayons);
    } catch (error) {
        console.error('Error fetching rayons:', error);
        res.status(500).json({ error: 'Failed to fetch rayons' });
    }
});


router.get('/', async (req, res) => {
    try {
        const listeRayons = await Rayon.findAll();

        if (listeRayons.length === 0) { // Correction de 'lenght' en 'length'
            return res.status(404).json({ error: 'Aucun Rayon trouvé dans la table Rayon' });
        }
        const formattedRayons = listeRayons.map(rayon=> ({
            ...rayon.dataValues,
            createdAt: moment(rayon.createdAt).format('DD-MM-YYYY'),
            updatedAt: moment(rayon.updatedAt).format('DD-MM-YYYY'),
        }));

           
        res.json(formattedRayons);
    } catch (error) {
        console.error('Error fetching rayons:', error);
        res.status(500).json({ error: 'Failed to fetch rayons' });
    }
});


// Route pour obtenir tous les rayons avec leurs promotions
// GET all rayons with their promotions
router.get('/promotion', async (req, res) => {
    try {
        // Fetch all rayons
        const rayons = await Rayon.findAll();

        // Fetch promotions for each rayon
        const rayonsWithPromotions = await Promise.all(rayons.map(async (rayon) => {
            const promotions = await PromotionRayon.findAll({
                where: { id_rayon: rayon.id }
            });
            
            // Extract details of promotions (assuming one promotion per rayon for simplicity)
            const promotionsDetails = promotions.map(promo => ({
                valeur_promotion: promo.valeur,
                date_debut: promo.date_debut,
                date_fin: promo.date_fin
            }));

            // Return rayon details with merged promotions
            return {
                ...rayon.dataValues,
                ...promotionsDetails[0] // Assumes only one promotion per rayon for simplification
            };
        }));

        // Send response with rayons and their promotions
        res.json(rayonsWithPromotions);
    } catch (error) {
        console.error('Error fetching rayons with promotions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;


router.delete('/:id',async (req, res) => {
    const rayonId = req.params.id;

    try {
        
        const rayon = await Rayon.findOne({ where: { id: rayonId } });

        if (!rayon) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await rayon.destroy();

        // Send success message
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting rayon:', error);
        res.status(500).json({ error: 'Failed to delete rayon' });
    }
});

router.get('/compter/count', async (req, res) => {
    try {
        const count = await Rayon.count();
        res.json({ count });
    } catch (error) {
        console.error('Error counting rayons:', error);
        res.status(500).json({ error: 'Failed to count rayons' });
    }
});

module.exports = router;
