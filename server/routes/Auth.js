const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/AthMiddleware'); // Adjust the path as necessary

// Route to check if the user is authenticated
router.get('/', validateToken, async(req, res) => {
    res.status(200).json({ message: 'Token is valid' });
});

module.exports = router;
