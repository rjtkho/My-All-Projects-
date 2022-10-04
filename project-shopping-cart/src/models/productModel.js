const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
        title: { type: String, required: true, unique: true, trim: true, lowercase: true },
        description: { type: String, required: true, trim: true },
        price: { type: Number, required: true, trim: true },
        currencyId: { type: String, required: true, trim: true },
        currencyFormat: { type: String, required: true, trim: true },
        isFreeShipping: { type: Boolean, default: false, trim: true },
        productImage: { type: String, required: true },
        style: { type: String },
        availableSizes: { type: [String], enum: ["S", "XS", "M", "X", "L", "XXL", "XL"] },
        installments: { type: Number },
        deletedAt: { type: Date, default: null },
        isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema)