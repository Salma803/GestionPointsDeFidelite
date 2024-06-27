const express = require('express');
const router = express.Router();
const { CarteFidelite, Achat, ChequeCadeau } = require('../models');
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

module.exports = router;
