const mongoose = require('mongoose')
const internSchema = new mongoose.Schema({


    isDeleted: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    mobile: {
        type: Number,
        unique: true,
        trim: true
    },
    collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "college",
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },




}, { timestamps: true })


module.exports = mongoose.model("intern", internSchema);