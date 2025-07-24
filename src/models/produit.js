const { Schema, model } = require('mongoose');

const productSchema = Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0.0 },
    color: [{ type: String }],
    image: { type: String, required: true },
    images: [{ type: String }],
    //reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    //numberOfReviews: { type: Number, default: 0 },
    size: [{ type: String }],
    categorie: { type: Schema.Types.ObjectId, ref: 'Categorie', required: true },
    genderAgeCategorie: { type: String, enum: ['homme', 'femme', 'fille', 'enfant'] },
    countInStock: { type: Number, required: true, min: 0, max: 255 },
    dateAdded: { type: Date, default: Date.now() },

});

//pre-save hook
// productSchema.pre('save', async function (next) {
//     if (this.reviews.length > 0) {
//         await this.populate('reviews');

//         const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);

//         this.rating = totalRating / this.reviews.length;
//         this.rating = parseFloat((totalRating / this.reviews.length).toFixed(1));
//         this.numberOfReviews = this.reviews.length;
//     }

//     next();

// });

productSchema.index({ name: 'text' , description: 'text'} );

// productSchema.virtual('productInitial').get(function (){
//     return this.firstBit + this.secondBit;
// });

productSchema.set('toObject', {virtuals: true});
productSchema.set('toJSON', {virtuals: true});

exports.Product = model('Product',productSchema);

