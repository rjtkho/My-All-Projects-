const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        require: true

    },
    items: [
        {
            productId: {
                type: mongoose.Types.ObjectId,
                ref: "Product",
                require: true
            },
            quantity: { type: Number, require: true, min: 1 }
        }

    ],
    totalPrice: { type: Number, require: true },
    totalItems: { type: Number, require: true },
    totalQuantity: { type: Number, require: true },
    cancellable: { type: Boolean, default: true },
    status: { type: String, default: 'pending', enum: ['pending', 'completed', 'cancelled'] },
    deletedAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },

})

module.exports = mongoose.model("Order", orderSchema)