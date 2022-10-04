const express = require("express")
const router = express.Router()
const { authentication, authorization } = require("../middleware/auth");
const { userRegister, userLogin, getUserDetails, updateUserDetails } = require('../controllers/userController')
const { createProducts, getAllProduct, getProductsById, UpdateProducts, DeleteProducts } = require('../controllers/productController')
const { createCart, updateCart, getCartDeatils, DeleteCart } = require('../controllers/cartController')
const { createOrder, updateOrder } = require('../controllers/orderController')

//============= User Routes============================================================================================//
router.post('/register', userRegister)
router.post('/login', userLogin)
router.get('/user/:userId/profile', authentication, authorization, getUserDetails)
router.put('/user/:userId/profile', authentication, authorization, updateUserDetails)

//============= Products Routes============================================================================================//
router.post('/products', createProducts)
router.get('/products', getAllProduct)
router.get('/products/:productId', getProductsById)
router.put('/products/:productId', UpdateProducts)
router.delete('/products/:productId', DeleteProducts)

//===============Cart Routes=====================================================================================================//
router.post('/users/:userId/cart', authentication, authorization, createCart)
router.put('/users/:userId/cart', authentication, authorization, updateCart)
router.get('/users/:userId/cart', authentication, authorization, getCartDeatils)
router.delete('/users/:userId/cart', authentication, authorization, DeleteCart)


//============Order Routes ================================================================================================================//
router.post('/users/:userId/orders', authentication, authorization, createOrder)
router.put('/users/:userId/orders', authentication, authorization, updateOrder)



router.all('/**', function (req, res) {
    res.status(404).send({
        status: false,
        message: "The api you requested is not available. Make sure your endpoint is correct or not."
    })
})





module.exports = router