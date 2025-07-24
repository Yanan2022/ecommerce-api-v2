const { Schema , model } = require('mongoose');

const commandeSchema = Schema({
     articleDeLaCommande: [
        { type: Schema.Types.ObjectId, ref: 'articleDeLaCommande', required: true},

    ],
    shippingAdress: { type: String , required: true},
    city: { type: String , required: true},
    postalCode: String,
    country: { type: String , required: true},
    phone: { type: String , required: true},
    paymentId: String,
    status: {
        type: String,
        required: true,
        default: 'pending',
        enum: ['pending', 'processed', 'shipped', 'out-for-delivery', 'delivered', 'cancelled', 'on-hold', 'expired'],
        
    },

    statusHistory: {
        type: [String] , 
        required: true,
        enum: ['pending', 'processed', 'shipped', 'out-for-delivery', 'delivered', 'cancelled', 'on-hold', 'expired'],
        default: ['pending']
    },

    totalPrice: Number,
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    dateOrdered: { type: Date, default: Date.now() },
    
});

orderSchema.set('toObject', {virtuals: true});
orderSchema.set('toJSON', {virtuals: true});


exports.Commande = model('commande', orderSchema);