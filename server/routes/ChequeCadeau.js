const express = require('express');
const router = express.Router();
const { ChequeCadeau, CarteFidelite } = require('../models');
const { v4: uuidv4 } = require('uuid');

// Function to generate a unique code for gift cards
function generateUniqueCode() {
    return uuidv4().replace(/-/g, '').slice(0, 16); // Generate a 16-character code
}

router.post('/:idClient', async (req, res) => {
    const idClient = req.params.idClient;

    try {
        // Fetch the client's loyalty card
        let carteFidelite = await CarteFidelite.findOne({
            where: { id_client: idClient }
        });

        // If loyalty card not found, create one
        if (!carteFidelite) {
            carteFidelite = await CarteFidelite.create({
                id_client: idClient,
                point: 0,
                reste: 0
            });
        }

        // Check if points exceed 100
        if (carteFidelite.point >= 100) {
            const pointsToRedeem = Math.floor(carteFidelite.point / 100) * 100;
            const newPoints = carteFidelite.point - pointsToRedeem;
            const expirationDate = new Date();
            expirationDate.setMonth(expirationDate.getMonth() + 1); // Set expiration date to one month from now

            // Create gift cards for the client
            const giftCards = [];
            for (let i = 0; i < pointsToRedeem / 100; i++) {
                giftCards.push({
                    id_client: idClient,
                    date_expiration: expirationDate,
                    statut: 'valide',
                    code: generateUniqueCode()
                });
            }
            await ChequeCadeau.bulkCreate(giftCards);

            // Update loyalty card with new points
            await CarteFidelite.update(
                { point: newPoints },
                { where: { id_client: idClient } }
            );

            return res.status(200).json({ message: 'Gift cards created and loyalty points updated successfully' });
        } else {
            return res.status(200).json({ message: 'Insufficient points to create a gift card' });
        }
    } catch (error) {
        console.error('Error processing the request:', error);
        return res.status(500).json({ error: 'Failed to process the request' });
    }
});
//Voir les cheques cadeau d'un client donne en
router.get('/:idClient', async (req, res) => {
    const idClient = req.params.idClient;

    try {
        // Fetch gift cards for the specified client
        const giftCards = await ChequeCadeau.findAll({
            where: { id_client: idClient }
        });

        if (giftCards.length === 0) {
            return res.status(404).json({ message: 'No gift cards found for this client' });
        }

        return res.status(200).json(giftCards);
    } catch (error) {
        console.error('Error fetching gift cards:', error);
        return res.status(500).json({ error: 'Failed to fetch gift cards' });
    }
});

module.exports = router;
