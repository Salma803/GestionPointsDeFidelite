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


const updateLoyaltyPointsAndCreateGiftCards = async () => {
    try {
        const clients = await CarteFidelite.findAll();

        for (const client of clients) {
            const idClient = client.id_client;
            const carteFidelite = await CarteFidelite.findOne({
                where: { id_client: idClient }
            });

            if (carteFidelite.point >= 100) {
                const pointsToRedeem = Math.floor(carteFidelite.point / 100) * 100;
                const newPoints = carteFidelite.point - pointsToRedeem;
                const expirationDate = new Date();
                expirationDate.setMonth(expirationDate.getMonth() + 1);

                const giftCards = [];
                for (let i = 0; i < pointsToRedeem / 100; i++) {
                    giftCards.push({
                        id_client: idClient,
                        date_expiration: expirationDate,
                        statut: 'Valide',
                        code: generateUniqueCode()
                    });
                }
                await ChequeCadeau.bulkCreate(giftCards);
                await CarteFidelite.update(
                    { point: newPoints },
                    { where: { id_client: idClient }
                });
            }
        }
        console.log('Gift cards created and loyalty points updated successfully');
    } catch (error) {
        console.error('Error processing the loyalty points:', error);
    }
};
cron.schedule('* * * * *', async () => {
    console.log('Running the loyalty points update job');
    await updateLoyaltyPointsAndCreateGiftCards();
});

//Voir les cheques cadeau d'un client donne en
router.get('/:idClient', async (req, res) => {
    const idClient = req.params.idClient;

    try {
        // Fetch gift cards for the specified client
        const giftCards = await ChequeCadeau.findAll({
            where: { id_client: idClient }
        });
        
        

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

router.get('/admin/pourcentage/timeline', async (req, res) => {
    try {
        // Définir la plage de temps pour les données (par exemple, les 30 derniers jours)
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        const endDate = new Date();

        // Récupérer les chèques cadeaux créés dans la plage de temps
        const giftCards = await ChequeCadeau.findAll({
            where: {
                createdAt: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                }
            },
            attributes: ['statut', 'createdAt']
        });

        const data = {};

        // Initialiser l'objet data avec toutes les dates dans la plage de temps
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            data[dateStr] = { valid: 0, expired: 0, consumed: 0 };
        }

        // Remplir l'objet data avec les comptes réels des chèques cadeaux
        giftCards.forEach(card => {
            const date = card.createdAt.toISOString().split('T')[0]; // formater la date en YYYY-MM-DD
            if (!data[date]) {
                data[date] = { valid: 0, expired: 0, consumed: 0 };
            }
            if (card.statut === 'Valide') {
                data[date].valid++;
            } else if (card.statut === 'Expiré') {
                data[date].expired++;
            } else if (card.statut === 'Consommé') {
                data[date].consumed++;
            }
        });

        // Convertir l'objet data en tableau pour le graphique
        const result = Object.keys(data).map(date => ({
            date,
            valid: data[date].valid,
            expired: data[date].expired,
            consumed: data[date].consumed
        }));

        res.json(result);
    } catch (error) {
        console.error('Error fetching gift card status timeline:', error);
        res.status(500).json({ error: 'Failed to fetch gift card status timeline' });
    }
});


cron.schedule('* * * * *', async () => {
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

module.exports = router;