const express = require('express');
const router = express.Router();
const { Panier, Client, Produit } = require('../models');
const { where } = require('sequelize');

router.post('/', async (req, res) => {
    const { quantité, id_client, id_produit } = req.body;

    try {
        // Vérifier que tous les champs sont déclarés
        if (!quantité || !id_client || !id_produit) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        // Vérifier si le client existe
        const client = await Client.findByPk(id_client);
        if (!client) {
            return res.status(404).json({ error: 'Client non trouvé' });
        }

        // Vérifier si le produit existe
        const produit = await Produit.findByPk(id_produit);
        if (!produit) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        // Vérifier si le produit est déjà dans le panier du client
        let panierItem = await Panier.findOne({
            where: {
                id_client: id_client,
                id_produit: id_produit
            }
        });

        if (panierItem) {
            // Si l'élément du panier existe, augmenter la quantité par celle demandée
            panierItem.quantité += quantité;
            await panierItem.save();
        } else {
            // Si l'élément du panier n'existe pas, créer un nouveau
            panierItem = await Panier.create({
                quantité,
                id_client,
                id_produit,
            });
        }

        res.status(201).json(panierItem);
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout du produit au panier' });
    }
});


//Voir tous les elements du panier

router.get('/:clientId', async (req, res) => {
    const clientId = req.params.clientId; // Extract clientId from request parameters

    try {
        // Fetch all items in Panier for the specified client, including associated Produit details
        const listePanier = await Panier.findAll({
            where: {
                id_client: clientId 
            },
            include: [{
                model: Produit,
                attributes: ['nom', 'prix'] // Specify attributes to include from Produit
            }]
        });

        res.json(listePanier); // Send JSON response with cart items and associated product details
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json('Failed to fetch cart items'); // Handle server error
    }
});



//Soustraire la quantité

router.put('/soustraire/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const panierItem = await Panier.findByPk(id);
        if (!panierItem) {
            return res.status(404).json({ error: 'Panier item non trouvé' });
        }

        if (panierItem.quantité <= 1) {
            return res.status(400).json({ error: 'Quantité insuffisante dans le panier pour la soustraction' });
        }

        panierItem.quantité -= 1; 
        await panierItem.save();

        res.status(200).json(panierItem);
    } catch (error) {
        console.error('Error subtracting quantity:', error);
        res.status(500).json({ error: 'Failed to subtract quantity' });
    }
});


//ajouter la quantité d'un produit
router.put('/ajouter/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const panierItem = await Panier.findByPk(id);
        if (!panierItem) {
            return res.status(404).json({ error: 'Panier item non trouvé' });
        }

        

        panierItem.quantité += 1; 
        await panierItem.save();

        res.status(200).json(panierItem);
    } catch (error) {
        console.error('Error subtracting quantity:', error);
        res.status(500).json({ error: 'Failed to subtract quantity' });
    }
});


//supprimer un element du panier 
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const panierItem = await Panier.findByPk(id);
        if (!panierItem) {
            return res.status(404).json({ error: 'Panier item non trouvé' });
        }

        await panierItem.destroy();
        res.status(200).json({ message: 'Panier item supprimé' });
    } catch (error) {
        console.error('Error deleting panier item:', error);
        res.status(500).json({ error: 'Failed to delete panier item' });
    }
});


//supprimer tous le panier
router.delete('/client/:clientId', async (req, res) => {
    const { clientId } = req.params;

    try {
        await Panier.destroy({
            where: {
                id_client: clientId,
            },
        });
        res.status(200).json({ message: 'Panier supprimé' });
    } catch (error) {
        console.error('Error deleting cart:', error);
        res.status(500).json({ error: 'Failed to delete cart' });
    }
});

//passer a l'achat du panier




module.exports = router;


