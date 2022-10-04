const mongoose = require('mongoose')
const cartModel = require('../models/cartModel')
const userModel = require('../models/userModel')
const productModel = require('../models/productModel')


exports.createCart = async (req, res) => {
    try {
        let userId = req.params.userId
        let data = req.body
        let totalPrice = 0;
        let checkCart = await cartModel.findOne({ userId: userId })
        
        if (!checkCart) {
            data.userId = userId
            let { productId, quantity } = data
            if (!mongoose.Types.ObjectId.isValid(productId)) return res.status(400).send({ status: false, message: "productId is not valid" })
            if (data.hasOwnProperty("quantity")) {
                if (quantity <= 0) return res.status(400).send({ status: false, message: "quantity should not be 0" })
            } else {
                quantity = 1
            }
            let findProduct = await productModel.findOne({ _id: productId, isDeleted: false })
            if (!findProduct) return res.status(404).send({ status: false, message: "Product not found" })
            data.items = { productId, quantity }
            totalPrice = totalPrice + (findProduct.price * quantity)
            data.totalItems = 1
            data.totalPrice = totalPrice
            let createCart = await cartModel.create(data)
            return res.status(201).send({ status: true, message: "Cart Successfully created", data: createCart })
        }

        if (checkCart) {
            let { productId, quantity } = data
            if (!mongoose.Types.ObjectId.isValid(productId)) return res.status(400).send({ status: false, message: "productId is not valid" })
            if (data.hasOwnProperty("quantity")) {
                if (quantity <= 0) return res.status(400).send({ status: false, message: "quantity should be 0" })
            } else {
                quantity = 1
            }
            let findProduct = await productModel.findOne({ _id: productId, isDeleted: false })
            if (!findProduct) return res.status(404).send({ status: false, message: "Product not found" })

            let findObjIdIndex = checkCart.items.findIndex(obj => obj.productId.toString() === productId)

            if (checkCart.items[findObjIdIndex]) {
                checkCart.items[findObjIdIndex].quantity += quantity
                checkCart.totalPrice = checkCart.totalPrice + (findProduct.price * quantity)
            }
            else {
                checkCart.items.push({ productId, quantity })
                checkCart.totalPrice = checkCart.totalPrice + (findProduct.price * quantity)
            }


            checkCart.totalItems = checkCart.items.length
            let createCart = await cartModel.findByIdAndUpdate(checkCart._id, checkCart, { new: true }).select({ "items._id": 0 })//.populate("items.productId", { title: 1, _id: 0, price: 1 })
            return res.status(200).send({ status: true, message: "Product SuccessFully Added", data: createCart })
        }
    }


    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

exports.updateCart = async (req, res) => {
    try {

        let userId = req.params.userId
        let data = req.body
       console.log(data)
        let checkCart = await cartModel.findOne({ userId: userId })
        if (!checkCart) return res.status(404).send({ status: false, message: "There is No cart present for this User" })

        let { productId, removeProduct } = data

        if (!mongoose.Types.ObjectId.isValid(productId)) return res.status(400).send({ status: false, message: "productId is not valid" })
        if(!data.hasOwnProperty("removeProduct")) return res.status(400).send({ status: false, message:"please enter removeProduct"})
        if(![0,1].includes(removeProduct)) return res.status(400).send({ status: false, message:"removeProduct must be either 0 or 1 numeric only"})

        findProductIndex = checkCart.items.findIndex((obj) => obj.productId == productId)
        if (!checkCart.items[findProductIndex]) return res.status(404).send({ status: false, message: "This Product is not Present in Your Cart" })

        let product = await productModel.findOne({ _id: productId })
       

        if (removeProduct === 1) {

            checkCart.items[findProductIndex].quantity -= 1

            if (checkCart.items[findProductIndex].quantity === 0) {
                checkCart.items.splice(findProductIndex, 1)
                checkCart.totalItems -= 1
            }

            checkCart.totalPrice = checkCart.totalPrice - (product.price)

        }
        else if (removeProduct === 0) {
            checkCart.totalPrice = checkCart.totalPrice - (product.price * (checkCart.items[findProductIndex].quantity))
            checkCart.items.splice(findProductIndex, 1)
            checkCart.totalItems -= 1
        }

        let cartUpdate = await cartModel.findOneAndUpdate({ _id: checkCart._id }, checkCart, { new: true })
        return res.status(200).send({ status: true, message: "Cart SuccessFully Update", data: cartUpdate })
    }
    
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

exports.getCartDeatils = async (req, res) => {

    try {

        let userId = req.params.userId
        let checkCart = await cartModel.findOne({ userId: userId })
        if (!checkCart) return res.status(404).send({ status: false, message: "cart not found" })
        return res.status(200).send({ status: true, message: "Cart details found successfully", data:checkCart })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

exports.DeleteCart = async (req, res) => {
   try{
     let userId = req.params.userId
    let checkCart = await cartModel.findOne({ userId: userId })
    if (!checkCart) return res.status(404).send({ status: false, message: "cart not found" })

    if (checkCart.items.length === 0) return res.status(400).send({ status: false, message: "cart is already deleted" })

    await cartModel.findOneAndUpdate({ _id: checkCart._id }, { $set: { items: [], totalPrice: 0, totalItems: 0 } }, { new: true })
    return res.status(204).send({ status: true, message: "cart Deleted Succesfully" })  //204 = No content found. It removes the message//
} catch (error) {
    return res.status(500).send({ status: false, message: error.message })
}

}
