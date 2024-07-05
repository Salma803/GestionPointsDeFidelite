const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');
const { sequelize,Admin,Client,CarteFidelite} = require('../models'); 
const { validateToken } = require('../middlewares/AthMiddleware');
const moment = require('moment');




//Connexion de l'admin ou on compare juste le mot de passe non chiffré (un souci avec ce concept)
router.post('/login', async (req, res) => {
    const { email, mot_de_passe } = req.body;

    try {
        // Find Admin by email
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

router.post('/creerclient', async (req, res) => {
    const { nom, prenom, adresse, email, mot_de_passe, telephone } = req.body;
    
    try {
        // Validate input
        if (!email || !mot_de_passe || !telephone) {
            return res.status(400).json({ error: 'Email, password, and telephone are required' });
        }

        // Check if client with the same email or telephone already exists
        const existingClientEmail = await Client.findOne({ where: { email } });
        const existingClientTelephone = await Client.findOne({ where: { telephone } });

        if (existingClientEmail) {
            return res.status(401).json({ error: 'Email is already taken' });
        }

        if (existingClientTelephone) {
            return res.status(402).json({ error: 'Phone Number is already taken' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10); // Adjust salt rounds as needed

        // Create the new client
        const newClient = await Client.create({
            nom,
            prenom,
            adresse,
            email,
            telephone,
            mot_de_passe: hashedPassword, // Store hashed password in the database
        });

        // Create loyalty card for the new client
        await CarteFidelite.create({
            id_client: newClient.id,
            points: 0,
            reste: 0,
        });

        // Return the newly created client as JSON response
        res.status(201).json(newClient);

    } catch (error) {
        console.error('Error creating client:', error);
        res.status(500).json({ error: 'Failed to create client' });
    }
});


router.get('/listeclients', async (req, res) => {
    try {
        const listeClients = await Client.findAll({ 
            attributes: ['id', 'prenom', 'nom', 'email', 'adresse', 'telephone', 'createdAt', 'updatedAt'] 
        });
        if (listeClients.length === 0) {
            return res.json({ message: "aucun client" });
        }
        
        const formattedClients = listeClients.map(client => ({
            ...client.dataValues,
            createdAt: moment(client.createdAt).format('YYYY-MM-DD HH:mm:ss'),
            updatedAt: moment(client.updatedAt).format('YYYY-MM-DD HH:mm:ss')
        }));
        
        res.json(formattedClients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Failed to fetch clients' });
    }
});



router.delete('/:id',async (req, res) => {
    const clientId = req.params.id;

    try {
        // Find client by ID
        const client = await Client.findOne({ where: { id: clientId } });

        // Check if client exists
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // Delete the client
        await client.destroy();

        // Send success message
        res.json({ message: 'Client deleted successfully' });
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ error: 'Failed to delete client' });
    }
});
router.put('/:id', async (req, res) => {
    const clientId = req.params.id;
    const { nom, prenom, adresse, email, telephone, mot_de_passe } = req.body;

    try {
        // Find client by ID
        let client = await Client.findOne({ where: { id: clientId } });

        // Check if client exists
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // Update client fields
        client.nom = nom || client.nom;
        client.prenom = prenom || client.prenom;
        client.adresse = adresse || client.adresse;
        client.email = email || client.email;
        client.telephone = telephone || client.telephone;

        // Hash the new password if provided
        if (mot_de_passe) {
            const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
            client.mot_de_passe = hashedPassword;
        }

        // Save the updated client
        await client.save();

        // Return updated client as JSON response
        res.json(client);

    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ error: 'Failed to update client' });
    }
});

// GET client by ID
router.get('/client/:id', async (req, res) => {
    const clientId = req.params.id;

    try {
        const client = await Client.findOne({ where: { id: clientId } });

        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        res.json(client);
    } catch (error) {
        console.error('Error fetching client:', error);
        res.status(500).json({ error: 'Failed to fetch client' });
    }
});

//get the info of an admin
router.get('/find/:adminID', async (req, res) => {
    const { adminID } = req.params; // Extract adminID from req.params
    try {
        const admin = await Admin.findOne({ where: { id: adminID } });
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.json(admin);
    } catch (error) {
        console.error('Error fetching Admin:', error);
        res.status(500).json({ error: 'Failed to fetch admin' });
    }
});

router.put('/changer/:adminId', async (req, res) => {
    const { adminId } = req.params;
    const { email, password } = req.body;

    // Valider les données d'entrée
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Rechercher l'administrateur dans la base de données
        const admin = await Admin.findOne({ where: { id: adminId } });

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        // Hacher le nouveau mot de passe

        // Mettre à jour les champs email et mot de passe
        admin.email = email;
        admin.mot_de_passe = password;
        await admin.save();

        res.json({ message: 'Admin email and password updated successfully' });
    } catch (error) {
        console.error('Error updating admin email and password:', error);
        res.status(500).json({ error: 'Failed to update admin email and password' });
    }
});

module.exports = router;
