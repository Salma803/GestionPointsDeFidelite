const express = require('express');
const router = express.Router();
const { Rayon } = require('../models'); 

router.post('/creerrayon', async (req, res) => {
    const { nom } = req.body;

    try {
        // Vérifier si un rayon avec le même nom existe déjà
        const existingRayon = await Rayon.findOne({
            where: { nom }
        });

        // Si un rayon avec ce nom existe déjà, renvoyer une erreur
        if (existingRayon) {
            return res.status(400).json({ error: 'Un rayon avec ce nom existe déjà' });
        }

        // Créer le nouveau rayon
        const newRayon = await Rayon.create({
            nom
        });

        // Retourner le nouveau rayon créé en réponse JSON
        res.status(201).json(newRayon);

    } catch (error) {
        console.error('Error creating rayon:', error);
        res.status(500).json({ error: 'Failed to create rayon' });
    }
});

router.get('/', async (req, res) => {
    try {
        const listeRayons= await Rayon.findAll();
        res.json(listeRayons);
    } catch (error) {
        console.error('Error fetching rayons:', error);
        res.status(500).json('Failed to fetch rayons');
    }
});

module.exports = router;
