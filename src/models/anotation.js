const { Schema , model } = require('mongoose');

const reviewSchema = Schema({
    // productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    utilisateur: { type: Schema.Types.ObjectId, ref: ' utilisateur', required: true },
    nomutilisateur: {type: String, required: true},
    commentaire: { type: String, trim: true},
    notation: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
})



reviewSchema.set('toObject', {virtuals: true});
reviewSchema.set('toJSON', {virtuals: true});

exports.Review = model('Review', reviewSchema);