
const { validationResult } = require('express-validator');
const multer = require('multer');
const media_helper = require('./../helpers/media_helper');
const util = require('util');
const { Categorie } = require('./../models/categorie');
const moment = require('moment');



exports.ajouterCategories = async (req, res) => {


    try {
        const uploadImage = util.promisify(media_helper.upload.fields([{ name: 'image', maxCount: 1 }]));

        try {
            await uploadImage(req, res);
        } catch (error) {
            console.error(error);
            return res.status(500).json(
                {
                    type: error.code || 'UPLOAD_ERROR',
                    message: `${error.message} ${error.field ? '{ ' + error.field + ' }' : ''}`,
                    storageErrors: error.storageErrors || null,
                }
            );
        }


        const image = req.files['image'][0];
        if (!image) return res.status(404).json({ message: ' Not file found !' });

        // req.body['image'] = ` ${req.protocol}://${req.get('host')}/${image.path}`;
        req.body['image'] = `${req.protocol}://${req.get('host')}/uploads/${image.filename}`;

        let category = new Categorie(req.body);

        category = await category.save();
        if (!category) {
            return res.status(500).json({ message: 'La catégorie n\'a pas été créée.' });
        }
        return res.status(201).json(category);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.message, message: error.message });
    }
};

exports.listeCategories = async (req, res) => {
    try {
        const categories = await Categorie.find().select('name image color').sort({ createdAt: -1 });

        const categoriesFormates = categories.map(categorie => {
            const formattedDate = moment(categorie.createdAt).format('DD/MM/YYYY HH:mm:ss');

            // Retourner un nouvel objet client avec la date formatée
            return {
                ...categorie._doc, // Pour déstructurer les autres champs du client
                createdAt: formattedDate // On remplace createdAt par la date formatée
            };
        });
        if (!categoriesFormates) {
            return res.status(404).json({ message: 'Pas de catégories trouvées!' });
        }

        return res.json(categoriesFormates);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.message, message: error.message });
    }
};








exports.editerCategories = async (req, res) => {
    try {
        const { name, icon, colour } = req.body;
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, icon, colour },
            { new: true }
        );
        if (!category) return res.status(404).json({ message: 'Category not found!' });
        return res.json(category);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.message, message: error.message });
    }
}

exports.modifierUneCategorie = async (req, res) => {
    console.log('modifierUneCategorie');

    try {
        const uploadImage = util.promisify(
            media_helper.upload.fields([{ name: 'image', maxCount: 1 }])
        );

        try {
            await uploadImage(req, res);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                type: error.code,
                message: ` ${error.message} { ${error.field} }`,
                storageErrors: error.storageErrors,
            });
        }

        const { name } = req.body;
        const image = req.files && req.files['image'] && req.files['image'][0];

        const updateData = { name };
        if (image) {
            updateData.image = `${req.protocol}://${req.get('host')}/${image.path}`;
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }

        return res.status(200).json(category);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.message, message: error.message });
    }
};

exports.supprimerUneCategorie = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Catégorie non trouvée' });
        if (category.markedForDeletion) return res.status(410).json({ message: 'Catégorie déjà supprimée' });
        category.markedForDeletion = true;
        await category.save();
        return res.status(200).json({
            message: 'Catégorie supprimée avec succès'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.message, message: error.message });
    }
};