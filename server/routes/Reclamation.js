const express = require('express');
const router = express.Router();
const { Reclamation } = require('../models'); // Adjust the path according to your project structure

router.post('/:idClient', async (req, res) => {
    const { idClient } = req.params;
    const { objet,contenu } = req.body;
    const statut = "non_traité"; // Assuming "non_traité" is a string

    // Validate the contenu
    if (!contenu) {
        return res.status(400).json({ error: 'il faut un contenu de reclamation' });
    }

    try {
        // Create a new reclamation record in the database
        await Reclamation.create({
            objet:objet,
            contenu: contenu,
            statut: statut,
            id_client: idClient
        });

        // Respond with a success message
        res.status(201).json({ message: 'Reclamation créée avec succès' });
    } catch (error) {
        console.error('Error creating reclamation:', error);
        res.status(500).json({ error: 'Erreur lors de la création de la réclamation' });
    }
});

router.get('/:idClient', async (req, res) => {
    const { idClient } = req.params;
    try {
        // Get all reclamations from the database for a specific client
        const reclamations = await Reclamation.findAll({
            where: { id_client: idClient }
        });

        // Check if any reclamations are found
        if (reclamations.length === 0) {
            return res.status(404).json({ message: 'Aucune réclamation trouvée pour ce client' });
        }

        res.status(200).json(reclamations);
    } catch (error) {
        console.error('Error fetching reclamations:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des réclamations' });
    }
});

router.get('/', async (req, res) => {
    try {
        // Get all reclamations from the database
        const reclamations = await Reclamation.findAll();

        // Check if any reclamations are found
        if (reclamations.length === 0) {
            return res.status(404).json({ message: 'Aucune réclamation trouvée' });
        }

        res.status(200).json(reclamations);
    } catch (error) {
        console.error('Error fetching reclamations:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des réclamations' });
    }
});

// Update reclamation réponse
router.put('/:idReclamation', async (req, res) => {
    const { idReclamation } = req.params;
    const { réponse } = req.body;

    try {
        // Find the reclamation by id
        const reclamation = await Reclamation.findByPk(idReclamation);

        if (!reclamation) {
            return res.status(404).json({ error: 'Réclamation non trouvée' });
        }

        // Update the reclamation réponse
        reclamation.réponse = réponse;
        reclamation.statut = 'traité';
        await reclamation.save();

        res.status(200).json({ message: 'Réponse de la réclamation mise à jour avec succès' });
    } catch (error) {
        console.error('Error updating reclamation réponse:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la réponse de la réclamation' });
    }
});
router.get('/compter/count', async (req, res) => {
    try {
        const count = await Reclamation.count();
        res.json({ count });
    } catch (error) {
        console.error('Error counting products:', error);
        res.status(500).json({ error: 'Failed to count products' });
    }
});

module.exports = router;

