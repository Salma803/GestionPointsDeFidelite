const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {Op } = require('sequelize');
const router = express.Router();
const { Client } = require('../models'); 

const { validateToken } = require('../middlewares/AthMiddleware');
//trover les infos du client par id
router.get('/find/:clientID', async (req, res) => {
    const { clientID } = req.params; // Extract adminID from req.params
    try {
        const client = await Client.findOne({ where: { id: clientID } });
        if (!client) {
            return res.status(404).json({ error: 'client not found' });
        }
        res.json(client);
    } catch (error) {
        console.error('Error fetching Client:', error);
        res.status(500).json({ error: 'Failed to fetch Client' });
    }
});
//changer le mdp /email d'un client
router.put('/changer/:clientId', async (req, res) => {
    const { clientId } = req.params;
    const { email, adresse, currentPassword, newPassword } = req.body;

    // Valider les données d'entrée
    if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required' });
    }

    try {
        // Rechercher l'clientistrateur dans la base de données
        const client = await Client.findOne({ where: { id: clientId } });

        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // Vérifier le mot de passe actuel
        if (currentPassword != client.mot_de_passe) {
            return res.status(401).json({ error: 'Incorrect current password' });
        }

        // Mettre à jour les champs email, adresse et nouveau mot de passe si fournis
        if (email) {
            client.email = email;
        }

        if (newPassword) {
            const saltRounds = 10;
            client.mot_de_passe = newPassword;
        }

        if (adresse) {
            client.adresse = adresse;
        }

        await client.save();

        res.json({ message: 'Admin details updated successfully' });
    } catch (error) {
        console.error('Error updating client details:', error);
        res.status(500).json({ error: 'Failed to update client details' });
    }
});
//route de connexion du client
router.post('/login', async (req, res) => {
    const { email, mot_de_passe } = req.body;

    try {
        // Find Client by email
        const user = await Client.findOne({ where: { email: email } });

        // Check if Client exists
        if (!user) {
            return res.status(404).json({ error: "Client doesn't exist" });
        }
        //comparer les mot de passe hashé
        const match = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        if (!match) {
            return res.status(401).json({ error: "Wrong username and password combination" });
        }
        // Successful login
        const accessToken = jwt.sign( { email :user.email,  id :user.id }, "secret", {expiresIn: '1h'});
        res.json({ accessToken });

    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ error: 'Unexpected error during login' });
    }
});

//route pour trouver l'id du client connecté a ce moment à travers l'access token
router.get('/me', validateToken, (req, res) => {
    // req.user contains decoded token information
    const userId = req.user.id;
    res.json({ userId });
});

router.get('/count', async (req, res) => {
    try {
      const count = await Client.count();
      res.json({ count });
    } catch (error) {
      console.error('Error counting clients:', error);
      res.status(500).json({ error: 'Failed to count clients' });
    }
  });

router.get('/admin/pourcentage/timeline', async (req, res) => {
      try {
          // Set the time range for the data (e.g., last 30 days)
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - 30);
          const endDate = new Date();
  
          // Fetch clients created within the time range
          const clients = await Client.findAll({
              where: {
                  createdAt: {
                      [Op.gte]: startDate,
                      [Op.lte]: endDate
                  }
              },
              attributes: ['createdAt']
          });
  
          const data = {};
  
          // Initialize data object with all dates within the range
          for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
              const dateStr = d.toISOString().split('T')[0];
              data[dateStr] = { clients: 0 };
          }
  
          // Populate the data object with actual client counts
          clients.forEach(client => {
              const date = client.createdAt.toISOString().split('T')[0]; // format date as YYYY-MM-DD
              if (data[date]) {
                  data[date].clients += 1;
              }
          });
  
          // Convert the data object into an array for the chart
          const result = Object.keys(data).map(date => ({
              date,
              clients: data[date].clients
          }));
  
          res.json(result);
      } catch (error) {
          console.error('Error fetching clients join timeline:', error);
          res.status(500).json({ error: 'Failed to fetch clients join timeline' });
      }
  });
  
  
  

module.exports = router;
