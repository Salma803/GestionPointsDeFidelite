const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');
const { sequelize,Admin,Client} = require('../models'); 
const { validateToken } = require('../middlewares/AthMiddleware');

//Connexion de l'admin ou on compare juste le mot de passe non chiffré (un souci avec ce concept)
router.post('/login', async (req, res) => {
    const { email, mot_de_passe } = req.body;

    try {
        // Find Client by email
        const user = await Admin.findOne({ where: { email: email } });

        // Check if Admin exists
        if (!user) {
            return res.status(404).json({ error: "Client doesn't exist" });
        }
        //comparer les mot de passe hashé
        if (mot_de_passe != user.mot_de_passe) {
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

//Creation d'un client a travers l'admin,on voit d'abord si il n'ya pas un client avec le meme email
router.post('/creerclient',validateToken, async (req, res) => {
    const { nom, prenom, adresse, email, mot_de_passe } = req.body;

    try {
        // Validate input
        if (!email || !mot_de_passe) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check if client with the same email already exists
        const existingClient = await Client.findOne({ where: { email } });
        if (existingClient) {
            return res.status(400).json({ error: 'Email is already taken' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10); // Adjust salt rounds as needed

        // Create the new client
        const newClient = await Client.create({
            nom,
            prenom,
            adresse,
            email,
            mot_de_passe: hashedPassword // Store hashed password in the database
        });

        // Return the newly created client as JSON response
        res.status(201).json(newClient);

    } catch (error) {
        console.error('Error creating client:', error);
        res.status(500).json({ error: 'Failed to create client' });
    }
});


router.get('/test',validateToken,async(req,res)=>{
        const listclients = await Client.findAll();
        res.json(listclients);
    });
router.get('/listeclients', async (req, res) => {
        try {
            const listeClients= await Client.findAll({ attributes: ['id', 'username'] });
            res.json(listeClients);
        } catch (error) {
            console.error('Error fetching clients:', error);
            res.status(500).json('Failed to fetch clients');
        }
    });
    


// DELETE route to delete client by ID
router.delete('/client/:id',validateToken, async (req, res) => {
    const clientId = req.params.id;

    try {
        // Find client by ID
        const client = await Client.findOne({ where: { id: clientId } });

        // Check if client exists
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // Use Sequelize transaction for atomicity
        await sequelize.transaction(async (transaction) => {
            await client.destroy({ transaction });
        });

        // Send success message
        res.json({ message: 'Client deleted successfully' });
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ error: 'Failed to delete client' });
    }
});
module.exports = router;
