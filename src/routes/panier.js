const express = require('express');
const {body} = require('express-validator');
const router = express.Router();

const panierController = require('../controllers/panierController');

const validationPanier = [

    body('name').not().isEmpty().withMessage('Veillez renseigner le libelle, il est obligatoire'),
    body('color').not().isEmpty().withMessage('Veillez renseigner la couleur , il est obligatoire')

]





router.get('/user-panier',panierController.getUserCart);

router.get('/nombre-element-panier',panierController.getUserCartCount);


module.exports = router ;