const express = require('express');
const router = express.Router();
const { CarteFidelite,Client, Achat, ChequeCadeau } = require('../models');
const { Op } = require('sequelize');

// Route to update loyalty points and rest
router.post('/:clientId', async (req, res) => {
    const clientId = req.params.clientId;

    try {
        // Fetch all Achat records for the specified client
        const achats = await Achat.findAll({
            where: { id_client: clientId }
        });

        // Compute total points and rest
        let totalPoints = 0;

        for (const achat of achats) {
            totalPoints += achat.point + achat.reste;
        }

        // Fetch all existing cheque cards for the client
        const chequeCadeaux = await ChequeCadeau.findAll({
            where: { id_client: clientId }
        });

        // Calculate points to subtract based on the number of cheque cards
        const totalChequesPoints = chequeCadeaux.length * 100;

        // Subtract the points related to the cheque cards
        totalPoints -= totalChequesPoints;

        // Calculate integer and decimal parts
        const integerPoints = Math.floor(totalPoints);
        const reste = totalPoints - integerPoints;

        // Fetch existing CarteFidelite entry for the client
        let existingCarte = await CarteFidelite.findOne({
            where: { id_client: clientId }
        });

        if (existingCarte) {
            // Update existing entry
            existingCarte.point = integerPoints;
            existingCarte.reste = reste;
            await existingCarte.save();
            res.status(200).json({ message: 'Loyalty points and rest updated successfully' });
        } else {
            // Create new entry if not found
            await CarteFidelite.create({
                id_client: clientId,
                point: integerPoints,
                reste: reste
            });
            res.status(201).json({ message: 'Loyalty points and rest created successfully' });
        }
    } catch (error) {
        console.error('Error updating loyalty points and rest:', error);
        res.status(500).json({ error: 'Failed to update loyalty points and rest' });
    }
});

// New route to fetch loyalty card details for a given client ID
router.get('/touver/:clientId', async (req, res) => {
    const clientId = req.params.clientId;

    try {
        // Fetch CarteFidelite entry for the specified client
        const carteFidelite = await CarteFidelite.findOne({
            where: { id_client: clientId }
        });

        if (!carteFidelite) {
            return res.status(404).json({ error: 'Carte de fidélité non trouvée pour ce client' });
        }

        res.status(200).json(carteFidelite);
    } catch (error) {
        console.error('Error fetching loyalty card:', error);
        res.status(500).json({ error: 'Failed to fetch loyalty card' });
    }

});


router.get('/', async (req, res) => {
    try {
        const cartesFidelite = await CarteFidelite.findAll({
            include: [{
                model: Client,
                attributes: ['nom', 'prenom','email', 'telephone']
            }]
        });

        if (!cartesFidelite || cartesFidelite.length === 0) {
            return res.status(404).json({ error: 'Aucune carte de fidélité trouvée' });
        }

        res.status(200).json(cartesFidelite);
    } catch (error) {
        console.error('Erreur lors de la récupération des cartes de fidélité:', error);
        res.status(500).json({ error: 'Échec de la récupération des cartes de fidélité' });
    }
});


// Update point and reste of a CarteFidelite


router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { point, reste } = req.body;

    // Validation des champs point et restessss
    if (  point < 0) {
        return res.status(400).json({ error: 'Point must be a positive number' });
    }
    if (reste < 0 || reste > 1) {
        return res.status(400).json({ error: 'Reste must be between 0 and 1' });
    }

    try {
        const [updated] = await CarteFidelite.update({ point,reste }, { where: { id } });

        if (updated) {
            const updatedCarte = await CarteFidelite.findOne({ where: { id } });
            return res.status(200).json(updatedCarte);
        } else {
            return res.status(404).json({ error: 'CarteFidelite not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});




router.delete('/:id',async (req, res) => {
    const carteId = req.params.id;

    try {
        // Find client by ID
        const carteFidelite = await CarteFidelite.findOne({ where: { id: carteId } });

        // Check if carteFidelite exists
        if (!carteFidelite) {
            return res.status(404).json({ error: 'carteFidelite not found' });
        }

        // Delete the carteFidelite
        await carteFidelite.destroy();

        // Send success message
        res.json({ message: 'carteFidelite deleted successfully' });
    } catch (error) {
        console.error('Error deleting carteFidelite:', error);
        res.status(500).json({ error: 'Failed to delete carteFidelite' });
    }
});
router.get('/count', async (req, res) => {
    try {
      const count = await CarteFidelite.count();
      res.json({ count });
    } catch (error) {
      console.error('Error counting loyalty cards:', error);
      res.status(500).json({ error: 'Failed to count loyalty cardss' });
    }
  });

module.exports = router;
