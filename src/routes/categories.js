const express = require('express');
const {body} = require('express-validator');
const router = express.Router();

const categorieController = require('../controllers/categoriesController');

const validationCategorie = [

    body('name').not().isEmpty().withMessage('Veillez renseigner le libelle, il est obligatoire'),
    body('color').not().isEmpty().withMessage('Veillez renseigner la couleur , il est obligatoire')

]

//router.post('/', validationCategorie, categorieController.ajouterUneCategorie);
router.post('/',categorieController.ajouterCategories);
router.get('/',categorieController.listeCategories);
router.delete('/:id',categorieController.supprimerUneCategorie);
router.get('/:id',categorieController.editerCategories);
router.put('/:id',categorieController.modifierUneCategorie);

module.exports = router ; 
