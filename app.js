const express = require('express');
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
require('dotenv/config');
const mongoose = require('mongoose') 


const app = express();
const env = process.env;
const API = env.API_URL;

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());

const categorieRouter = require('./src/routes/categories.js')
const produitRouter = require('./src/routes/produits.js')
const panierRouter = require('./src/routes/panier.js')
//const API_URL = /api/V1/
// console.log(API);
app.use(`${API}/categories`, categorieRouter);
app.use(`${API}/produits`, produitRouter);
app.use(`${API}/panier`,panierRouter);
//app.use(`${API}/listesCategories`, categorieRouter);

//Demarrage du serveur//

const hostname = env.HOSTNAME;
const port = env.PORT ;
// console.log('voici le resultat',env.MONGODB_CONNEXION_STRING);
mongoose.connect(env.MONGODB_CONNEXION_STRING).then(()=>{
    console.log('connexion reussie a mongodb')
}).catch((error)=>{
    console.error(error)
})


// console.log('voici le resultat', API);
app.listen(port,() => {
  console.log(`Le serveur a demarre sur http://${hostname}:${port}`);
});
