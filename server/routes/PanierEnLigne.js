const express = require('express');
const router = express.Router();
const { PanierEnLigne,Regle, Client, Produit,Achat,Detail,PromotionProduit,PromotionRayon } = require('../models');
const {Op } = require('sequelize');

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

        // Vérifier si le produit est déjà dans le PanierEnLigne du client
        let panierItem = await PanierEnLigne.findOne({
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
            panierItem = await PanierEnLigne.create({
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
        const listePanier = await PanierEnLigne.findAll({
            where: {
                id_client: clientId 
            },
            include: [{
                model: Produit,
                attributes: ['nom', 'prix', 'id', 'id_rayon'] // Include additional attributes required for promotions
            }]
        });

        // Iterate through the cart items to calculate the discounted prices
        const panierAvecPrixSolde = await Promise.all(listePanier.map(async (item) => {
            const produit = item.Produit;

            // Check if the product has an active promotion
            const promotionProduit = await PromotionProduit.findOne({
                where: {
                    id_produit: produit.id,
                    valeur: {
                        [Op.ne]: 0 // Non-zero value indicates an active promotion
                    },
                    date_debut: {
                        [Op.lte]: new Date() // Promotion start date is before or equal to today
                    },
                    date_fin: {
                        [Op.gte]: new Date() // Promotion end date is after or equal to today
                    }
                }
            });

            const promotionRayon = await PromotionRayon.findOne({
                where: {
                    id_rayon: produit.id_rayon,
                    valeur: {
                        [Op.ne]: 0 // Non-zero value indicates an active promotion
                    },
                    date_debut: {
                        [Op.lte]: new Date() // Promotion start date is before or equal to today
                    },
                    date_fin: {
                        [Op.gte]: new Date() // Promotion end date is after or equal to today
                    }
                }
            });

            let estSolde = false;
            let valeurSolde = 0;

            if (promotionProduit || promotionRayon) {
                estSolde = true;
                if (promotionRayon && promotionProduit) {
                    valeurSolde = Math.max(promotionRayon.valeur, promotionProduit.valeur);
                } else if (promotionRayon) {
                    valeurSolde = promotionRayon.valeur;
                } else if (promotionProduit) {
                    valeurSolde = promotionProduit.valeur;
                }
            }

            let prixApresSolde = produit.prix;
            if (estSolde) {
                prixApresSolde = produit.prix - (produit.prix * (valeurSolde / 100));
            }

            // Attach the calculated discounted price to the product
            produit.dataValues.prixApresSolde = prixApresSolde;

            return item;
        }));

        res.json(panierAvecPrixSolde); // Send JSON response with cart items and associated product details including discounted prices
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json('Failed to fetch cart items'); // Handle server error
    }
});







//Soustraire la quantité

router.put('/soustraire/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const panierItem = await PanierEnLigne.findByPk(id);
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
        const panierItem = await PanierEnLigne.findByPk(id);
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
        const panierItem = await PanierEnLigne.findByPk(id);
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
        await PanierEnLigne.destroy({
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

router.post('/achat/:clientId', async (req, res) => {
    const clientId = req.params.clientId;

    try {
        console.log('Client ID:', clientId);

        // Vérifier si le client existe
        const client = await Client.findByPk(clientId);
        if (!client) {
            return res.status(404).json({ error: 'Client non trouvé' });
        }
        console.log('Client trouvé:', client);

        // Récupérer tous les éléments du panier du client
        const panierItems = await PanierEnLigne.findAll({
            where: { id_client: clientId },
            include: [{ model: Produit }]
        });
        console.log('Panier items:', panierItems);

        if (panierItems.length === 0) {
            return res.status(400).json({ error: 'Le panier est vide' });
        }

        // Calculer la somme totale des quantités multipliées par le prix des produits
        let totalSum1 = 0;
        let totalSum2 = 0;
        let totalPoints = 0;

        for (const item of panierItems) {
            const produit = item.Produit;

            // Vérifier si le produit est soldé
            let estSolde = false;
            let valeurSolde = 0;

            // Check for active promotions
            const promotionProduit = await PromotionProduit.findOne({
                where: {
                    id_produit: produit.id,
                    valeur: {
                        [Op.ne]: 0 // Non-zero value indicates an active promotion
                    },
                    date_debut: {
                        [Op.lte]: new Date() // Promotion start date is before or equal to today
                    },
                    date_fin: {
                        [Op.gte]: new Date() // Promotion end date is after or equal to today
                    }
                }
            });

            if (promotionProduit) {
                estSolde = true;
                valeurSolde = promotionProduit.valeur;
            } else {
                // Check for rayon-level promotion if no product-level promotion found
                const promotionRayon = await PromotionRayon.findOne({
                    where: {
                        id_rayon: produit.id_rayon,
                        valeur: {
                            [Op.ne]: 0 // Non-zero value indicates an active promotion
                        },
                        date_debut: {
                            [Op.lte]: new Date() // Promotion start date is before or equal to today
                        },
                        date_fin: {
                            [Op.gte]: new Date() // Promotion end date is after or equal to today
                        }
                    }
                });

                if (promotionRayon) {
                    estSolde = true;
                    valeurSolde = promotionRayon.valeur;
                }
            }

            // Calculate price after discount if product is soldé
            let prixApresSolde;
            const regle = await Regle.findOne({
                where: { id_rayon: produit.id_rayon }
            });
            const multiplicite = regle ? regle.multiplicite : 1;

            if (estSolde) {
                prixApresSolde = produit.prix - (produit.prix * (valeurSolde / 100));
            } else {
                prixApresSolde = produit.prix;
            }

            totalPoints += Math.floor(produit.prix * item.quantité * multiplicite);
            totalSum2 += prixApresSolde * item.quantité;
            totalSum1 += prixApresSolde * item.quantité;
        }

        console.log('Total sum:', totalSum1);
        console.log('Total points:', totalPoints);

        // Définir point et reste
        let point = totalPoints;
        let reste = totalSum2 - totalPoints;

        // Adjust reste to be less than 1 and a decimal
        while (reste >= 1) {
            point += 1;
            reste -= 1;
        }

        // Créer une nouvelle ligne dans la table Achat
        const nouvelAchat = await Achat.create({
            id_client: clientId,
            total: totalSum1,
            point: point,
            reste: reste,
            id_magasin: 1 // Assuming store ID 1 for now
        });
        console.log('Nouvel achat:', nouvelAchat);

        // Ajouter des lignes correspondantes dans la table Detail
        for (const item of panierItems) {
            const produit = item.Produit;

            // Vérifier si le produit est soldé (détails)
            let estSolde = false;
            let valeurSolde = 0;

            const promotionProduit = await PromotionProduit.findOne({
                where: {
                    id_produit: produit.id,
                    valeur: {
                        [Op.ne]: 0
                    },
                    date_debut: {
                        [Op.lte]: new Date()
                    },
                    date_fin: {
                        [Op.gte]: new Date()
                    }
                }
            });

            if (promotionProduit) {
                estSolde = true;
                valeurSolde = promotionProduit.valeur;
            } else {
                const promotionRayon = await PromotionRayon.findOne({
                    where: {
                        id_rayon: produit.id_rayon,
                        valeur: {
                            [Op.ne]: 0
                        },
                        date_debut: {
                            [Op.lte]: new Date()
                        },
                        date_fin: {
                            [Op.gte]: new Date()
                        }
                    }
                });

                if (promotionRayon) {
                    estSolde = true;
                    valeurSolde = promotionRayon.valeur;
                }
            }

            let pointDetail = 0;
            let prixApresSolde;

            if (estSolde) {
                prixApresSolde = produit.prix - (produit.prix * (valeurSolde / 100));
            } else {
                const regle = await Regle.findOne({
                    where: { id_rayon: produit.id_rayon }
                });
                const multiplicite = regle ? regle.multiplicite : 1;
                prixApresSolde = produit.prix;
                pointDetail = Math.floor(produit.prix * item.quantité * multiplicite);
            }

            await Detail.create({
                id_achat: nouvelAchat.id,
                id_produit: item.id_produit,
                quantite: item.quantité,
                point: pointDetail,
                total: prixApresSolde * item.quantité
            });
            console.log('Detail ajouté pour produit:', item.id_produit);
        }

        // Vider le panier du client
        await PanierEnLigne.destroy({
            where: {
                id_client: clientId,
            },
        });
        console.log('Panier vidé pour client:', clientId);

        res.status(201).json({ message: 'Achat et détails ajoutés avec succès' });

    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'achat et des détails:', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'achat et des détails' });
    }
});



module.exports = router;


