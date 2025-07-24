
const { validationResult } = require('express-validator');
const multer = require('multer');
const media_helper = require('./../helpers/media_helper');
const util = require('util');
const { Product } = require('./../models/produit');
const moment = require('moment');
const { Categorie } = require('../models/categorie');



exports.ajouterProduitsold = async (req, res) => {


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

        let produit = new Product(req.body);

        produit = await produit.save();
        if (!produit) {
            return res.status(500).json({ message: 'Le produit n\'a pas été créée.' });
        }
        return res.status(201).json(produit);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.message, message: error.message });
    }
};


exports.listeProduits = async (req, res) => {
    try {
        const produits = await Product.find().select('name description price rating color image images size categorie genderAgeCategorie countInStock').sort({ createdAt: -1 });

        const produitsFormates = produits.map(produit => {
            const formattedDate = moment(produit.createdAt).format('DD/MM/YYYY HH:mm:ss');

            // Retourner un nouvel objet client avec la date formatée
            return {
                ...produit._doc, // Pour déstructurer les autres champs du client
                createdAt: formattedDate // On remplace createdAt par la date formatée
            };
        });
        if (!produitsFormates) {
            return res.status(404).json({ message: 'Pas de produit trouvées!' });
        }

        return res.json(produitsFormates);
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

exports.ajouterProduits = async (req, res) => {
    try {
        const uploadImage = util.promisify(media_helper.upload.fields([
            { name: 'image', maxCount: 1 },
            { name: 'images', maxCount: 10 }, // Multiple images can be uploaded simultaneously
        ]));

        try {
            await uploadImage(req, res);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                type: error.code,
                message:` ${error.message} { ${error.field} }`,
                storageErrors: error.storageErrors,
            });
        }

        // Correction ici : Utilisation de req.params.category
        console.log(req.body.categorie);
        
        const category = await Categorie.findById(req.body.categorie);
        if (!category) {
            return res.status(404).json({ message: 'Invalid category not found' });
        }
        if (category.markedForDeletion) {
            return res.status(404).json({ message: 'Category marked for deletion, you cannot add products to this category.' });
        }

        const image = req.files['image'] ? req.files['image'][0] : null;
        if (!image) return res.status(404).json({ message: 'No image file found!' });

        req.body['image'] =` ${req.protocol}://${req.get('host')}/${image.path}`;

        const gallery = req.files['images'];
        const imagePaths = [];
        if (gallery) {
            for (const img of gallery) {
                const imagePath =` ${req.protocol}://${req.get('host')}/${img.path}`;
                imagePaths.push(imagePath);
            }
        }
        if (imagePaths.length > 0) {
            console.log('ici')
            req.body['gallery'] = imagePaths; // Assurez-vous d'utiliser une clé cohérente
        }

        const product = new Product(req.body);
        const savedProduct = await product.save();
        if (!savedProduct) {
            return res.status(500).json({ message: 'The product could not be created.' });
        }
        return res.status(201).json(savedProduct);
    } catch (error) {
        console.error(error);
        if (error instanceof multer.MulterError) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(500).json({ type: error.name, message: error.message });
    }
};