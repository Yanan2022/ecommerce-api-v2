const express = require('express');
const {body} = require('express-validator');
const router = express.Router();

const produitsController = require('../controllers/produitsController');

// const validationProduit = [

//     body('libelle_produit').not().isEmpty().withMessage('Veillez renseigner le libelle, il est obligatoire'),
//     body('quantite ').not().isEmpty().withMessage('Veillez renseigner la quantite , il est obligatoire'),
//  body(' prix').not().isEmpty().withMessage('Veillez renseigner le prix , il est obligatoire')

// ]

router.get('/',produitsController.listeProduits);
router.post('/' ,produitsController.ajouterProduits);


module.exports = router ; 
