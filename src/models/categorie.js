const { Schema, model } = require('mongoose');

const categorySchema = Schema({
    name: { type: String, required: true },
    color: { type: String, default: '#000000' },
    image: { type: String, required: true },
    markedForDeletion: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

categorySchema.set('toObject', { virtuals: true });
categorySchema.set('toJSON', { virtuals: true });


exports.Categorie = model('Categorie', categorySchema);
