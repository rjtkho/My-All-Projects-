const jwt = require('jsonwebtoken')
const mongoose = require("mongoose")
const userModel = require('../models/userModel')

exports.authentication = async (req, res, next) => {
    try {
        let token = req.headers['authorization'];
        
        if (!token) return res.status(400).send({ status: false, message: "Token is missing" });
        token = token.split(" ") //used for remove Bearer keyword from token

        jwt.verify(token[1], "my@fifth@project@product@management", { ignoreExpiration:true }, //avoid the invalid error

         function (err, decodedToken) {
            if (err) return res.status(401).send({ status: false, message: "Token is invalid" });
            if (Date.now() > decodedToken.exp * 1000) 
                return res .status(401).send({ status: false, message: "Token expired" })
     
        req.userId = decodedToken.userId;
        console.log(req.userId)
console.log(decodedToken)        
        next();
    });
    } catch (error) { 
        return res.status(500).send({ status: false, message: error.message })
    }
}

exports.authorization = async (req, res, next) => {
    try {
        let userId = req.params.userId
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: "User id not valid" })
        let checkUser = await userModel.findById(userId)
        if (!checkUser) return res.status(404).send({ status: false, message: "User not found" })
        req.checkUser = checkUser
        if(userId!=req.userId) return res.status(403).send({ status: false, message: "user not authorized" })
        next();
    
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}