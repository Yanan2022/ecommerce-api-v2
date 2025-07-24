const { CartProduct } = require("../models/panier");
const { User } = require("../models/panier");
const { default: mongoose } = require("mongoose");


exports.getUserCart = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const cartProducts = await CartProduct.find({ _id: { $in: user.cart } });
        if (!cartProducts) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        const cart = [];

        for (const cartProduct of cartProducts) {
            const product = await Product.findById(cartProduct.product);
            if (!product) {
                cart.push({
                    ...cartProduct._doc,
                    productExists: false,
                    productOutOfStock: false,
                });
            } else {
                cartProduct.productName = product.name;
                cartProduct.productImage = product.image;
                cartProduct.productPrice = product.price;
                if (product.countInStock < cartProduct.quantity) {
                    cart.push({
                        ...cartProduct._doc,
                        productExists: true,
                        productOutOfStock: true,
                    });
                } else {
                    cart.push({
                        ...cartProduct._doc,
                        productExists: true,
                        productOutOfStock: false,
                    });
                }
            }

        }

        return res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.message, message: error.message });
    }
};

exports.getUserCartCount = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        return res.json(user.cart.length);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: error.message, message: error.message });
    }
};