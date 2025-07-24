const { Schema , model } = require('mongoose');

const panierProduitSchema = Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
    selectedSize: String,
    selectedColor: String,
    productName: { type: String, required: true},
    productImage: { type: String, required: true},
    productPrice: { type: Number, required: true},
    reservationExpiry: {
        type: Date,
        default: ()=> new Date(Date.now() + 30 * 60 * 1000),
    },
    reserved: { type: Boolean, default: true}
})

 panierProduitSchema .set('toObject', {virtuals: true});
 panierProduitSchema .set('toJSON', {virtuals: true});

exports.CartProduct = model('CartProduct', panierProduitSchema);