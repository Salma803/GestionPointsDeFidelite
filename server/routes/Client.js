const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const { Client } = require('../models'); 
const { validateToken } = require('../middlewares/AthMiddleware');


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
router.get('/me', validateToken, (req, res) => {
    // req.user contains decoded token information
    const userId = req.user.id;
    res.json({ userId });
});

module.exports = router;
