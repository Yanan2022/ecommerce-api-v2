const { Schema , model } = require('mongoose');

const ArticleDeCommandeSchema = Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true},
    productName: { type: String, required: true},
    productImage: { type: String, required: true},
    productPrice: { type: Number, required: true},
    quantity: { type: Number, default: 1},
    selectedSize: String,
    selectedColor: String,
    // totalPrice: { type: Number, required: true},
});

ArticleDeCommandeSchema.set('toObject', {virtuals: true});
ArticleDeCommandeSchema.set('toJSON', {virtuals: true});

exports.ArticleDeCommande = model('ArticleDeCommande', orderItemSchema);