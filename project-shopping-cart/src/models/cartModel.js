const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        require: true,
        unique: true
    },
    items: [
        {  _id: false,
            productId: {
                type: mongoose.Types.ObjectId, ref: "Product",
                require: true
            },
            quantity: { type: Number, require: true, min: 1 }
        }

    ],
    totalPrice: { type: Number, require: true },
    totalItems: { type: Number, require: true }





}, { timestamps: true })


module.exports = mongoose.model("cart", cartSchema)