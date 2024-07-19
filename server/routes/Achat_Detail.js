const express = require('express');
const router = express.Router();
const { Detail,Achat,Produit,Client,sequelize } = require('../models');
const Sequelize = require('sequelize')


router.get('/:idClient', async (req, res) => {
    const clientId = req.params.idClient;

    try {
        const achats = await Achat.findAll({
            where: { id_client: clientId }
        });


        const mappedAchats = achats.map(achat => ({
            id: achat.id,
            point: achat.point,
            total_achat: achat.total,
            date_achat: achat.createdAt,
            
        }));

        res.json(mappedAchats);
    } catch (error) {
        console.error('Error fetching details:', error);
        res.status(500).json({ error: 'Failed to fetch details' });
    }
});


router.get('/detail/:idAchat', async (req, res) => {
    const achatId = req.params.idAchat;

    try {
        const details = await Detail.findAll({
            where: { id_achat: achatId }
        });

        if (details.length === 0) {
            return res.status(200).json('Pas de détails correspondants pour cet achat');
        }

        const mappedDetails = await Promise.all(details.map(async detail => {
            const produit = await Produit.findByPk(detail.id_produit, {
                attributes: ['nom','ean1','prix'] // Specify the fields you want to include
            });

            return {
                id: detail.id,
                id_produit: detail.id_produit,
                quantite: detail.quantite,
                point: detail.point,
                total: detail.total,
                produit: {
                    nom: produit.nom,
                    ean1: produit.ean1,
                    prix: produit.prix
                }
            };
        }));

        res.json(mappedDetails);
    } catch (error) {
        console.error('Error fetching details:', error);
        res.status(500).json({ error: 'Failed to fetch details' });
    }
});


router.get('/compter/total', async (req, res) => {
    try {
        const totalAchats = await Achat.sum('total');
        const totalAchats1 = Math.floor(totalAchats);
        res.json({ total: totalAchats1 });
    } catch (error) {
        console.error('Error calculating total of achats:', error);
        res.status(500).json({ error: 'Failed to calculate total of achats' });
    }
});




router.get('/stat/produit', async (req, res) => {
    try {
        // Récupérer tous les produits avec leurs noms
        const produits = await Produit.findAll({
            attributes: ['id', 'nom']
        });

        // Exécuter une requête brute pour compter les occurrences de chaque produit dans la table details
        const [details] = await sequelize.query(`
            SELECT id_produit, COUNT(*) as nb_achats
            FROM details
            GROUP BY id_produit
        `);

        // Convertir les détails en un objet pour un accès rapide
        const detailCounts = {};
        details.forEach(detail => {
            detailCounts[detail.id_produit] = detail.nb_achats;
        });

        // Créer le résultat final en associant les noms des produits et leurs comptes
        const result = produits.map(produit => ({
            id_produit: produit.id_produit,
            nom: produit.nom,
            nb_achats: detailCounts[produit.id] || 0
        }));

        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur du serveur');
    }
});




module.exports = router;


