const express = require('express');
const router = express.Router();
const moment = require('moment');
const { Regle,Rayon } = require('../models'); // Assurez-vous d'importer correctement votre modèle Regle

router.post('/', async (req, res) => {
    const { multiplicite, date_debut, date_fin, id_rayon } = req.body;

    // Convertir les dates en utilisant moment
    const parsedDateDebut = moment(date_debut, 'DD/MM/YYYY', true);
    const parsedDateFin = moment(date_fin, 'DD/MM/YYYY', true);

    // Vérifier que les dates sont valides
    if (!parsedDateDebut.isValid() || !parsedDateFin.isValid()) {
        return res.status(400).json({ error: 'Format de date invalide. Utilisez "DD/MM/YYYY".' });
    }

    if (parsedDateFin.isSameOrBefore(parsedDateDebut)) {
        return res.status(400).json({ error: 'La date de fin doit être supérieure à la date de début' });
    }

    try {
        if (!multiplicite || !date_debut || !date_fin || !id_rayon) {
            return res.status(400).json({ error: 'Il faut que tous les champs soient entrés' });
        }

        const existingRegle = await Regle.findOne({ where: { id_rayon } });

        if (existingRegle) {
            await Regle.update(
                { multiplicite, date_debut: parsedDateDebut.toDate(), date_fin: parsedDateFin.toDate() },
                { where: { id_rayon } }
            );
            return res.status(200).json({ message: 'Règle mise à jour avec succès' });
        }

        const newRegle = await Regle.create({
            multiplicite,
            date_debut: parsedDateDebut.toDate(),
            date_fin: parsedDateFin.toDate(),
            id_rayon
        });
        res.status(201).json(newRegle);
    } catch (error) {
        console.error('Erreur lors de la création de la règle:', error);
        res.status(500).json({ error: 'Echec lors de la création de la règle' });
    }
});
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { multiplicite, date_debut, date_fin } = req.body;

    try {
        const updatedRegle = await Regle.update(
            { multiplicite, date_debut, date_fin },
            { where: { id } }
        );

        res.status(200).json(updatedRegle);
    } catch (error) {
        console.error('Error updating Regle:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const regles = await Regle.findAll({
            include: {
                model: Rayon,
                attributes: ['nom'], // Only select the 'nom' attribute from the Rayon model
            }
        });

        res.status(200).json(regles);
    } catch (error) {
        console.error('Erreur lors de la récupération des règles:', error);
        res.status(500).json({ error: 'Echec lors de la récupération des règles' });
    }
});


module.exports = router;
