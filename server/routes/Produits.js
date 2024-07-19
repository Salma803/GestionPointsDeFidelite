const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const { Produit,Rayon,PromotionProduit,PromotionRayon } = require('../models'); 
const {Op } = require('sequelize');
const moment =require('moment');

//Methode pour l'admin

router.post('/creerproduits', async (req, res) => {
    const { nom, description, ean1, ean2, prix, id_rayon, valeur_promotion, date_debut, date_fin } = req.body;
    const promotionValue = valeur_promotion !== undefined && valeur_promotion !== '' ? valeur_promotion : 0;
    const startDate = date_debut ? new Date(date_debut) : new Date();
    let finishDate;
        
    if (date_fin) {
        finishDate = new Date(date_fin);
    } else {
        finishDate = new Date(startDate);
        finishDate.setMonth(finishDate.getMonth() + 1);
    }

    if (finishDate <= startDate) {
        return res.status(400).json({ error: 'La date de fin doit être supérieure à la date de début' });
    }

    try {
        // Validate input
        if (!nom || !ean1 || !prix || !id_rayon) {
            return res.status(400).json({ error: 'Le nom, l\'ean1, le prix et l\'ID du produit sont requis' });
        }

        // Check if ean1 is unique
        const existingProduit = await Produit.findOne({ where: { ean1 } });
        if (existingProduit) {
            return res.status(400).json({ error: 'L\'ean1 doit être unique' });
        }

        // Set ean2 to null if it is an empty string
        const ean2Value = ean2 !== '' ? ean2 : null;

        // Check if ean2 is unique if provided
        if (ean2Value) {
            const existingProduitWithEan2 = await Produit.findOne({ where: { ean2: ean2Value } });
            if (existingProduitWithEan2) {
                return res.status(400).json({ error: 'L\'ean2 doit être unique' });
            }
        }

        // Create the new product
        const newProduit = await Produit.create({
            nom, description, ean1, ean2: ean2Value, prix, id_rayon
        });

        // Create promotion produit with default or provided value
        await PromotionProduit.create({
            id_produit: newProduit.id,
            valeur: promotionValue,
            date_debut: startDate,
            date_fin: finishDate
        });

        // Return the newly created product as JSON response
        res.status(201).json(newProduit);

    } catch (error) {
        console.error('Erreur lors de la création du produit :', error);
        res.status(500).json({ error: 'Échec de la création du produit' });
    }
});






//Methode pour le clients
//voir tous les produits avec leur prix avant promotion, la valeur de promotion et le prix apres solde avec condition de date 


// router.get('/produits', async (req, res) => {
//     try {
//         // Fetch all products with the associated rayon name
//         const listeProduits = await Produit.findAll({
//             include: [
//                 {
//                     model: Rayon,
//                     attributes: ['nom']
//                 }
//             ]
//         });

//         // Calculate discounted prices for each product
//         const produitsAvecPrixSoldes = await Promise.all(listeProduits.map(async (produit) => {
//             // Check if the product is on sale
//             const promotionProduit = await PromotionProduit.findOne({
//                 where: {
//                     id_produit: produit.id,
//                     valeur: {
//                         [Op.ne]: 0
//                     },
//                     date_debut: {
//                         [Op.lte]: new Date()
//                     },
//                     date_fin: {
//                         [Op.gte]: new Date()
//                     }
//                 }
//             });

//             const promotionRayon = await PromotionRayon.findOne({
//                 where: {
//                     id_rayon: produit.id_rayon,
//                     valeur: {
//                         [Op.ne]: 0
//                     },
//                     date_debut: {
//                         [Op.lte]: new Date()
//                     },
//                     date_fin: {
//                         [Op.gte]: new Date()
//                     }
//                 }
//             });

//             let estSolde = false;
//             let valeurSolde = 0;
//             let active = false;
//             let dateDebutPromo = null;
//             let dateFinPromo = null;
//             let dateDebutPromoProduit = null;
//             let dateFinPromoProduit = null;
//             let dateDebutPromoRayon = null;
//             let dateFinPromoRayon = null;
//             let valeurPromotionProduit = 0;
//             let valeurPromotionRayon = 0;

//             if (promotionProduit || promotionRayon) {
//                 estSolde = true;
//                 active = true; // Promotion is active
//                 if (promotionProduit && promotionRayon) {
//                     if (promotionProduit.valeur >= promotionRayon.valeur) {
//                         valeurSolde = promotionProduit.valeur;
//                         dateDebutPromo = promotionProduit.date_debut;
//                         dateFinPromo = promotionProduit.date_fin;
//                     } else {
//                         valeurSolde = promotionRayon.valeur;
//                         dateDebutPromo = promotionRayon.date_debut;
//                         dateFinPromo = promotionRayon.date_fin;
//                     }
//                 } else if (promotionProduit) {
//                     valeurSolde = promotionProduit.valeur;
//                     dateDebutPromo = promotionProduit.date_debut;
//                     dateFinPromo = promotionProduit.date_fin;
//                 } else {
//                     valeurSolde = promotionRayon.valeur;
//                     dateDebutPromo = promotionRayon.date_debut;
//                     dateFinPromo = promotionRayon.date_fin;
//                 }
//             }


//             let prixApresSolde = produit.prix;
//             if (estSolde) {
//                 prixApresSolde = produit.prix - (produit.prix * (valeurSolde / 100));
//             }

//             // Add discount information to the product
//             produit.dataValues.prixAvantSolde = produit.prix;
//             produit.dataValues.prixApresSolde = prixApresSolde;
//             produit.dataValues.valeurSolde = valeurSolde;
//             produit.dataValues.active = active;
//             produit.dataValues.dateDebutPromo = dateDebutPromo;
//             produit.dataValues.dateFinPromo = dateFinPromo;
//             produit.dataValues.nomRayon = produit.Rayon.nom;
//             return produit;
//         }));

        

//         res.json(produitsAvecPrixSoldes);
//     } catch (error) {
//         console.error('Error fetching products:', error);
//         res.status(500).json('Failed to fetch products');
//     }
// });
router.get('/produits', async (req, res) => {
    try {
        const listeProduits = await Produit.findAll({
            include: [
                {
                    model: Rayon,
                    attributes: ['nom']
                }
            ]
        });

        const produitsAvecPrixSoldes = await Promise.all(listeProduits.map(async (produit) => {
            const promotionProduit = await PromotionProduit.findOne({
                where: {
                    id_produit: produit.id,
                    valeur: { [Op.ne]: 0 },
                    date_debut: { [Op.lte]: new Date() },
                    date_fin: { [Op.gte]: new Date() }
                }
            });

            const promotionRayon = await PromotionRayon.findOne({
                where: {
                    id_rayon: produit.id_rayon,
                    valeur: { [Op.ne]: 0 },
                    date_debut: { [Op.lte]: new Date() },
                    date_fin: { [Op.gte]: new Date() }
                }
            });

            let valeurSolde = 0;
            let active = false;
            let dateDebutPromo = null;
            let dateFinPromo = null;

            if (promotionProduit || promotionRayon) {
                active = true;
                if (promotionProduit && promotionRayon) {
                    if (promotionProduit.valeur >= promotionRayon.valeur) {
                        valeurSolde = promotionProduit.valeur;
                        dateDebutPromo = promotionProduit.date_debut;
                        dateFinPromo = promotionProduit.date_fin;
                    } else {
                        valeurSolde = promotionRayon.valeur;
                        dateDebutPromo = promotionRayon.date_debut;
                        dateFinPromo = promotionRayon.date_fin;
                    }
                } else if (promotionProduit) {
                    valeurSolde = promotionProduit.valeur;
                    dateDebutPromo = promotionProduit.date_debut;
                    dateFinPromo = promotionProduit.date_fin;
                } else {
                    valeurSolde = promotionRayon.valeur;
                    dateDebutPromo = promotionRayon.date_debut;
                    dateFinPromo = promotionRayon.date_fin;
                }
            }

            let prixApresSolde = produit.prix;
            if (valeurSolde > 0) {
                prixApresSolde = produit.prix - (produit.prix * (valeurSolde / 100));
            }

            produit.dataValues.prixAvantSolde = produit.prix;
            produit.dataValues.prixApresSolde = prixApresSolde;
            produit.dataValues.valeurSolde = valeurSolde;
            produit.dataValues.active = active;
            produit.dataValues.dateDebutPromo = dateDebutPromo;
            produit.dataValues.dateFinPromo = dateFinPromo;

            return produit;
        }));

        res.json(produitsAvecPrixSoldes);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json('Failed to fetch products');
    }
});


router.get('/produitpromotion', async (req, res) => {
    try {
        // Fetch all products with the associated rayon name
        const listeProduits = await Produit.findAll({
            include: [
                {
                    model: Rayon,
                    attributes: ['nom']
                }
            ]
        });

        // Calculate discounted prices for each product
        const produitsAvecPrixSoldes = await Promise.all(listeProduits.map(async (produit) => {
            // Check if the product is on sale
            const promotionProduit = await PromotionProduit.findOne({
                where: {
                    id_produit: produit.id,
                    valeur: {
                        [Op.ne]: 0
                    },
                    date_debut: {
                        [Op.lte]: new Date() // Promotion start date is less than or equal to today
                    },
                    date_fin: {
                        [Op.gte]: new Date() // Promotion end date is greater than or equal to today
                    }
                }
            });

            let estSolde = false;
            let valeur_promotion = 0;
            let active = false;
            let date_debut = new Date();
            let date_fin = new Date();
            date_fin.setDate(date_fin.getDate() + 1); // End date is one day later

            let valeurPromotionProduit = 0;

            if (promotionProduit) {
                estSolde = true;
                active = true; // Promotion is active
                valeur_promotion = promotionProduit.valeur;
                date_debut = promotionProduit.date_debut;
                date_fin = promotionProduit.date_fin;
                valeurPromotionProduit = promotionProduit.valeur;
            }

            let prixApresSolde = produit.prix;
            if (estSolde) {
                prixApresSolde = produit.prix - (produit.prix * (valeur_promotion / 100));
            }

            // Add discount information to the product
            produit.dataValues.prixAvantSolde = produit.prix;
            produit.dataValues.prixApresSolde = prixApresSolde;
            produit.dataValues.valeur_promotion = valeur_promotion;
            produit.dataValues.active = active;
            produit.dataValues.date_debut = date_debut;
            produit.dataValues.date_fin = date_fin;
            produit.dataValues.nomRayon = produit.Rayon.nom;
            produit.dataValues.valeurPromotionProduit = valeurPromotionProduit;

            return produit;
        }));

        res.json(produitsAvecPrixSoldes);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json('Failed to fetch products');
    }
});



// Voir un produit spécifique par ID avec les promotions associées, y compris la vérification de la promotion du rayon et de la promotion produit*

router.get('/:idProduit', async (req, res) => {
    const { idProduit } = req.params; // Extraction de l'ID du produit depuis les paramètres d'URL

    try {
        // Recherche du produit par son ID
        const produit = await Produit.findByPk(idProduit);

        // Vérifiez si le produit existe
        if (!produit) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        // Recherche des promotions actives pour ce produit
        const promotionProduit = await PromotionProduit.findOne({
            where: {
                id_produit: idProduit,
                valeur: {
                    [Op.ne]: 0 // Exclure les promotions avec valeur 0 (pas de promotion)
                },
                date_debut: {
                    [Op.lte]: new Date() // La date de début de la promotion est inférieure ou égale à la date actuelle
                },
                date_fin: {
                    [Op.gte]: new Date() // La date de fin de la promotion est supérieure ou égale à la date actuelle
                }
            },
            attributes: ['valeur', 'date_debut', 'date_fin']
        });

        // Initialisation des variables pour les détails de la promotion
        let estSolde = false;
        let valeurSolde = 0;
        let active = false;
        let dateDebutPromo = null;
        let dateFinPromo = null;

        // Si une promotion est trouvée, mettez à jour les variables correspondantes
        if (promotionProduit) {
            estSolde = true;
            active = true; // La promotion est active
            valeurSolde = promotionProduit.valeur;
            dateDebutPromo = promotionProduit.date_debut;
            dateFinPromo = promotionProduit.date_fin;
        }

        // Calculer le prix après réduction s'il y a une promotion
        let prixApresSolde = produit.prix;
        if (estSolde) {
            prixApresSolde = produit.prix - (produit.prix * (valeurSolde / 100));
        }

        // Construire l'objet de réponse
        const responseProduit = {
            id: produit.id,
            nom: produit.nom,
            description: produit.description,
            ean1: produit.ean1,
            ean2: produit.ean2,
            prix: produit.prix,
            createdAt: produit.createdAt,
            updatedAt: produit.updatedAt,
            prixAvantSolde: produit.prix, // Prix d'origine
            prixApresSolde: prixApresSolde, // Prix après réduction si applicable
            valeurSolde: valeurSolde, // Valeur de la réduction si applicable
            active: active, // Boolean indiquant si une promotion est active
            dateDebutPromo: dateDebutPromo, // Date de début de la promotion si applicable
            dateFinPromo: dateFinPromo // Date de fin de la promotion si applicable
        };

        // Retourner la réponse JSON
        res.json(responseProduit);
    } catch (error) {
        console.error('Erreur lors de la récupération du produit par ID :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du produit par ID' });
    }
});

//Voir les produits par rayon

router.get('/rayon/:rayon', async (req, res) => {
    const { rayon } = req.params; // Extracting the category from the URL parameters

    try {
        // Fetch products by category
        const produits = await Produit.findAll({
            where: { id_rayon: rayon }
        });

        // Check if products are found
        if (!produits.length) {
            return res.status(404).json({ error: 'Aucun produit trouvé dans ce rayon' });
        }

        // Iterate over each product to check for active promotions
        const responseProduits = await Promise.all(produits.map(async (produit) => {
            const promotionProduit = await PromotionProduit.findOne({
                where: {
                    id_produit: produit.id,
                    valeur: {
                        [Op.ne]: 0 // Exclude promotions with 0 value
                    },
                    date_debut: {
                        [Op.lte]: new Date() // Promotion start date is less than or equal to current date
                    },
                    date_fin: {
                        [Op.gte]: new Date() // Promotion end date is greater than or equal to current date
                    }
                },
                attributes: ['valeur', 'date_debut', 'date_fin']
            });

            // Initialize promotion details
            let estSolde = false;
            let valeurSolde = 0;
            let active = false;
            let dateDebutPromo = null;
            let dateFinPromo = null;

            // Update promotion details if a promotion is found
            if (promotionProduit) {
                estSolde = true;
                active = true; // The promotion is active
                valeurSolde = promotionProduit.valeur;
                dateDebutPromo = promotionProduit.date_debut;
                dateFinPromo = promotionProduit.date_fin;
            }

            // Calculate price after discount if there is a promotion
            let prixApresSolde = produit.prix;
            if (estSolde) {
                prixApresSolde = produit.prix - (produit.prix * (valeurSolde / 100));
            }

            // Construct the response object for the product
            return {
                id: produit.id,
                nom: produit.nom,
                description: produit.description,
                ean1: produit.ean1,
                ean2: produit.ean2,
                prix: produit.prix,
                createdAt: produit.createdAt,
                updatedAt: produit.updatedAt,
                prixAvantSolde: produit.prix, // Original price
                prixApresSolde: prixApresSolde, // Price after discount if applicable
                valeurSolde: valeurSolde, // Discount value if applicable
                active: active, // Boolean indicating if a promotion is active
                dateDebutPromo: dateDebutPromo, // Promotion start date if applicable
                dateFinPromo: dateFinPromo // Promotion end date if applicable
            };
        }));

        // Return the response JSON
        res.json(responseProduits);
    } catch (error) {
        console.error('Erreur lors de la récupération des produits par rayon :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des produits par rayon' });
    }
});
router.delete('/:id',async (req, res) => {
    const productId = req.params.id;

    try {
        
        const product = await Produit.findOne({ where: { id: productId } });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await product.destroy();

        // Send success message
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});
router.put('/:id', async (req, res) => {
    const productId = req.params.id;
    const { nom, description, ean1,ean2, prix, id_rayon } = req.body;

    try {
        // Find product by ID
        let product = await Produit.findOne({ where: { id: productId } });

        // Check if product exists
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if the new ean1 is unique
        if (ean1) {
            const existingProduct1 = await Produit.findOne({ where: { ean1, id: { [Op.ne]: productId } } });
            if (existingProduct1) {
                return res.status(401).json({ error: 'ean1 must be unique' });
            }
        }
        if (ean2) {
            const existingProduct2 = await Produit.findOne({ where: { ean2, id: { [Op.ne]: productId } } });
            if (existingProduct2) {
                return res.status(402).json({ error: 'ean2 must be unique' });
            }
        }

        // Update product fields
        product.nom = nom || product.nom;
        product.description = description || product.description;
        product.ean1 = ean1 || product.ean1;
        product.ean2 = ean2 || product.ean2;
        product.prix = prix || product.prix;
        product.id_rayon = id_rayon || product.id_rayon;

        // Save the updated product
        await product.save();

        // Return updated product as JSON response
        res.json(product);

    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});
router.get('/compter/count', async (req, res) => {
    try {
        const count = await Produit.count();
        res.json({ count });
    } catch (error) {
        console.error('Error counting products:', error);
        res.status(500).json({ error: 'Failed to count products' });
    }
});



module.exports = router;