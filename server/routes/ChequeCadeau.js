const express = require('express');
const router = express.Router();
const {Op } = require('sequelize');
const cron = require('node-cron')
const { ChequeCadeau, CarteFidelite,Client} = require('../models');
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
            return res.status(201).json({ message: 'Insufficient points to create a gift card' });
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


router.get('/', async (req, res) => {
    try {
        const chequeCadeaux = await ChequeCadeau.findAll({
            include: [{
                model: Client,
                attributes: ['nom', 'prenom', 'email', 'telephone']
            }]
        });

        if (chequeCadeaux.length === 0) {
            return res.status(404).json({ error: 'Aucune chéque cadeaux trouvé' });
        }

        res.status(200).json(chequeCadeaux);
    } catch (error) {
        console.error('Error fetching cheque cadeau:', error);
        res.status(500).json({ error: 'Failed to fetch cheque cadeau' });
    }

});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { statut, date_expiration } = req.body;
    // Validation des champs point et restessss

    try {
        const [updated] = await ChequeCadeau.update({ statut,date_expiration }, { where: { id } });

        if (updated) {
            const updatedCheque = await ChequeCadeau.findOne({ where: { id } });
            return res.status(200).json(updatedCheque);
        } else {
            return res.status(404).json({ error: 'Cheque Cadeau not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.delete('/:id',async (req, res) => {
    const chequeId = req.params.id;

    try {
        // Find client by ID
        const chequeCadeaux = await ChequeCadeau.findOne({ where: { id: chequeId } });

        // Check if carteFidelite exists
        if (!chequeCadeaux) {
            return res.status(404).json({ error: 'chequeCadeau not found' });
        }

        // Delete the carteFidelite
        await chequeCadeaux.destroy();

        // Send success message
        res.json({ message: 'chequeCadeau deleted successfully' });
    } catch (error) {
        console.error('Error deleting chequeCadeau:', error);
        res.status(500).json({ error: 'Failed to delete carteFidelite' });
    }
});
router.get('/admin/count', async (req, res) => {
    try {
      const count = await ChequeCadeau.count();
      res.json({ count });
    } catch (error) {
      console.error('Error counting gift cards:', error);
      res.status(500).json({ error: 'Failed to count gift cards' });
    }
  });

function calculatePercentage(part, total) {
    return total > 0 ? ((part / total) * 100).toFixed(2) : 0;
}

  router.get('/admin/pourcentage', async (req, res) => {
    try {
        const totalCards = await ChequeCadeau.count();
        const validCards = await ChequeCadeau.count({ where:{statut: 'Valide' }});
        const expiredCards = await ChequeCadeau.count({ where:{statut: 'Expiré' } });
        const consumedCards = await ChequeCadeau.count({ where:{statut: 'Consommé' } });

        const validPercentage = calculatePercentage(validCards, totalCards);
        const expiredPercentage = calculatePercentage(expiredCards, totalCards);
        const consumedPercentage = calculatePercentage(consumedCards, totalCards);

        res.json({
            total: totalCards,
            valid: {
                count: validCards,
                percentage: validPercentage
            },
            expired: {
                count: expiredCards,
                percentage: expiredPercentage
            },
            consumed: {
                count: consumedCards,
                percentage: consumedPercentage
            }
        });
    } catch (error) {
        console.error('Error counting gift cards:', error);
        res.status(500).json({ error: 'Failed to count gift cards' });
    }
});

cron.schedule('0 * * * *', async () => {
    try {
        const cheques = await ChequeCadeau.findAll();
        for (const cheque of cheques) {
            if (cheque.date_expiration < new Date() && cheque.statut !== 'Expiré') {
                cheque.statut = 'Expiré';
                await cheque.save();
            }
        }
        console.log('Statuts des chèques cadeaux mis à jour.');
    } catch (error) {
        console.error('Erreur lors de la mise à jour des statuts des chèques cadeaux:', error);
    }
});



module.exports = router;
cron.schedule('0 * * * *', async () => {
    try {
        const cheques = await ChequeCadeau.findAll({
            where: {
                statut: {
                    [Op.ne]: 'Consommé' // Op.ne signifie "not equal", donc statut différent de 'Consommé'
                }
            }
        });
        for (const cheque of cheques) {
            if (cheque.date_expiration < new Date() && cheque.statut !== 'Expiré') {
                cheque.statut = 'Expiré';
                await cheque.save();
            }
        }
        console.log('Statuts des chèques cadeaux mis à jour.');
    } catch (error) {
        console.error('Erreur lors de la mise à jour des statuts des chèques cadeaux:', error);
    }
});