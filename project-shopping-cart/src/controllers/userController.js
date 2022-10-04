const userModel = require('../models/userModel')
const { isValid, parseJSONSafely } = require('../validator/validator.js')
const awsController = require("../controllers/awsController")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

const saltRounds = 10;
const validName = /^[a-zA-Z ]{3,20}$/
const validEmail = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}/
const validPhoneNumber = /^[0]?[6789]\d{9}$/
const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
const validPincode = /^[1-9]{1}[0-9]{2}[0-9]{3}$/




exports.userRegister = async (req, res) => {
    try {
        let data = req.body
        let files = req.files
    console.log(files)
        let { fname, lname, email, profileImage, phone, password, address, ...rest } = data
      
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please enter some data in request body" })
        if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: "Invalid attribute in request body" })
        if (!fname) return res.status(400).send({ status: false, message: "fname is required" })
        if (!lname) return res.status(400).send({ status: false, message: "lname is required" })
        if (!email) return res.status(400).send({ status: false, message: "email is required" })
        if (!phone) return res.status(400).send({ status: false, message: "phone is required" })
        if (!password) return res.status(400).send({ status: false, message: "password is required" })
        if (!address) return res.status(400).send({ status: false, message: "address is required" })
       //  if(files.profileImage==0) return res.status(400).send({ status: false, message: "profileImage is required" })

        if (!validName.test(fname)) return res.status(400).send({ status: false, message: "fname is Invalid" })
        if (!validName.test(lname)) return res.status(400).send({ status: false, message: "lname is invalid" })
        if (!validEmail.test(email)) return res.status(400).send({ status: false, message: "email is invalid" })
        if (!validPhoneNumber.test(phone)) return res.status(400).send({ status: false, message: "phone is invalid" })
        if (!validPassword.test(password)) {
            return res.status(400).send({
                status: false,
                message: "password must have atleast 1digit , 1uppercase , 1lowercase , special symbols(@$!%*?&) and between 8-15 range, ex:Nitin@123"
            })
        }

        address = parseJSONSafely(address)
     
        if (!isNaN(address) || !address) return res.status(400).send({ status: false, message: "Address should be in Object Format look like this. {'key':'value'} and value cannot start with 0-Zero" })
        if (!Object.keys(address).length) return res.status(400).send({ status: false, message: "Shipping and Billing Address are Required" })
        let { shipping, billing, ...remaining } = address
        if (!address.hasOwnProperty("shipping")) return res.status(400).send({ status: false, message: "Shipping Address is required " })
        if (!address.hasOwnProperty("billing")) return res.status(400).send({ status: false, message: "billing Address is required " })

        if (Object.keys(remaining).length > 0) return res.status(400).send({ status: false, message: "Invalid attribute in address body" })

        if (typeof shipping !== "object") return res.status(400).send({ status: false, message: "shipping should be an object" })
        if (!shipping.hasOwnProperty("street")) return res.status(400).send({ status: false, message: "Shipping street is required " })
        if (!shipping.hasOwnProperty("city")) return res.status(400).send({ status: false, message: "Shipping city is required " })
        if (!shipping.hasOwnProperty("pincode")) return res.status(400).send({ status: false, message: "Shipping pincode is required " })

        if (!isValid(shipping.street)) return res.status(400).send({ status: false, message: " shipping street is invalid " })
        if (!validName.test(shipping.city)) return res.status(400).send({ status: false, message: "Shipping city is invalid" })
        if (!validPincode.test(shipping.pincode)) return res.status(400).send({ status: false, message: " shipping pincode is invalid. There must be six digits" })



        if (typeof billing !== "object") return res.status(400).send({ status: false, message: "billing should be an object" })
        if (!billing.hasOwnProperty("street")) return res.status(400).send({ status: false, message: "billing street is required " })
        if (!billing.hasOwnProperty("city")) return res.status(400).send({ status: false, message: "billing city is required " })
        if (!billing.hasOwnProperty("pincode")) return res.status(400).send({ status: false, message: "billing pincode is required " })

        if (!isValid(billing.street)) return res.status(400).send({ status: false, message: " billing street is invalid " }) 
        if (!validName.test(billing.city)) return res.status(400).send({ status: false, message: "billing city is invalid" })
        if (!validPincode.test(billing.pincode)) return res.status(400).send({ status: false, message: " billing pincode is invalid. There must be six digits" })
   
        data.address = address

        let findEmail = await userModel.findOne({ email: email })
        if (findEmail) return res.status(400).send({ status: false, message: "Email already exist" })

        let findPhone = await userModel.findOne({ phone: phone })
        if (findPhone) return res.status(400).send({ status: false, message: "Phone Number already exist" })

        data.password = bcrypt.hashSync(password, saltRounds)
        if (!files.length) return res.status(400).send({ status: false, message: "Please Provide the Image file" })

        mimetype = files[0].mimetype.split("/") //---["image",""]
        
        if (mimetype[0] !== "image") return res.status(400).send({ status: false, message: "Please Upload the Image File only" })
        if (files && files.length > 0) var uploadedFileURL = await awsController.uploadFile(files[0])
        data.profileImage = uploadedFileURL
       
      
   
        const creatUser = await userModel.create(data)
        return res.status(201).send({ status: true, message: "User Created Successfully", data: creatUser })
       
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }



}

exports.userLogin = async function (req, res) {
    try {
        let credentials = req.body
        if (Object.keys(credentials).length == 0) return res.status(400).send({ status: false, message: "Please enter email & password" })
        let { email, password } = credentials
        if (!email) return res.status(400).send({ status: false, message: "email is required" })
        if (!password) return res.status(400).send({ status: false, message: "password is required" })
        if (!validEmail.test(email)) return res.status(400).send({ status: false, message: `Email is not valid ${email}` }) 
        if (!validPassword.test(password)) return res.status(400).send({ status: false, message: `password is not valid ${password}` }) 

        let user = await userModel.findOne({ email: email })
        if (!user) return res.status(404).send({ status: false, message: "User not found" })

        bcrypt.compare(password, user.password, function (err, result) {

            if (result) {
                console.log("It matches!")
                const token = jwt.sign({
                    userId: user._id,
                    iat: Math.floor(Date.now() / 1000),  //issue time
                    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 //expiry time is 24 hours
                }, "my@fifth@project@product@management")

                let final = { userId: user._id, token: token }
                return res.status(200).send({ status: true, message: 'user login successfully', data: final })
            }
            return res.status(400).send({ status: false, message: "Invalid credentials" })
        });



    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
exports.getUserDetails = async (req, res) => {
    
    try {
        checkUser = req.checkUser// this code is related to middleware authorization
        return res.status(200).send({ status: true, message: "User profile details", data: checkUser })
    } catch (error) {

        return res.status(500).send({ status: false, message: error.message })

    }

}

exports.updateUserDetails = async (req, res) => {
    try {
        let userId = req.params.userId
        let data = req.body
        data = JSON.parse(JSON.stringify(data));  //used for remove [Object: null prototype]
        let files = req.files
        console.log(files)
        let { fname, lname, email, profileImage, phone, password, address, ...rest } = data

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please enter some data in request body" })
        if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: "Invalid attribute in request body" })

     
        finduser = req.checkUser // this code is related to middleware authorization
      //  console.log(finduser.fname)
        if (data.hasOwnProperty("fname")) {
            if (!validName.test(fname)) return res.status(400).send({ status: false, message: "fname is Invalid" })
            finduser.fname = fname  //user model fname change with i am update  fname
          
        }
        if (data.hasOwnProperty("lname")) {
            if (!validName.test(lname)) return res.status(400).send({ status: false, message: "lname is Invalid" })
            finduser.lname = lname
        }
        if (data.hasOwnProperty("email")) {
            if (!validEmail.test(email)) return res.status(400).send({ status: false, message: "email is invalid" })
            let findEmail = await userModel.findOne({ email: email })
            if (findEmail) return res.status(400).send({ status: false, message: "Email already exist" })
            finduser.email = email
        }
        if (data.hasOwnProperty("phone")) {
            if (!validPhoneNumber.test(phone)) return res.status(400).send({ status: false, message: "Phone Number is invalid" })
            let findPhone = await userModel.findOne({ phone: phone })
            if (findPhone) return res.status(400).send({ status: false, message: "Phone Number already exist" })
            finduser.phone = phone
        }
        if (data.hasOwnProperty("password")) {
            if (!validPassword.test(password)) return res.status(400).send({ status: false, message: "password must have atleast 1digit , 1uppercase , 1lowercase , special symbols(@$!%*?&) and between 8-15 range, ex:Nitin@123" })
            finduser.password = bcrypt.hashSync(password, saltRounds)
        }
        if (files.length > 0) {
            mimetype = files[0].mimetype.split("/")
            if (mimetype[0] !== "image") return res.status(400).send({ status: false, message: "Please Upload the Image File only" })
            if (files && files.length > 0) var uploadedFileURL = await awsController.uploadFile(files[0])
            finduser.profileImage = uploadedFileURL
        }

        if (data.hasOwnProperty("address")) {
            address = parseJSONSafely(address)
            if (!isNaN(address) || !address) return res.status(400).send({ status: false, message: "Address should be in JSON Object Format look like this. {'key':'value'} and value can't be start with 0-zero" })
            if (!Object.keys(address).length) return res.status(400).send({ status: false, message: "Please mention either Shipping or Billing Address " })// I added this line here

            if (address.shipping) {
                if (!Object.keys(address.shipping).length) return res.status(400).send({ status: false, message: "Please mention shipping (street||city||pincode)  " })// I added this line here 
                let { street, city, pincode } = address.shipping;
                if (address.shipping.hasOwnProperty("street")) {
                    if (!isValid(street)) return res.status(400).send({ status: false, message: "Shipping Street is invalid" })
                    finduser.address.shipping.street = street;
                }
                if (address.shipping.hasOwnProperty("city")) {
                    if (!validName.test(city)) return res.status(400).send({ status: false, message: "Shipping city is invalid" })
                    finduser.address.shipping.city = city;
                }
                if (address.shipping.hasOwnProperty("pincode")) {
                    if (!validPincode.test(pincode)) return res.status(400).send({ status: false, message: " Shipping pincode is invalid" })
                    finduser.address.shipping.pincode = pincode;
                }
            }

            if (address.billing) {
                if (!Object.keys(address.billing).length) return res.status(400).send({ status: false, message: "Please mention Billing (street||city||pincode) " })// I added this line here
                let { street, city, pincode } = address.billing;
                if (address.billing.hasOwnProperty("street")) {
                    if (!isValid(street)) return res.status(400).send({ status: false, message: "billing street is invalid" })
                    finduser.address.billing.street = street;
                }
                if (address.billing.hasOwnProperty("city")) {
                    if (!validName.test(city)) return res.status(400).send({ status: false, message: "billing city is invalid" })
                    finduser.address.billing.city = city;
                }
                if (address.billing.hasOwnProperty("pincode")) {
                    if (!validPincode.test(pincode)) return res.status(400).send({ status: false, message: " billing pincode is invalid" })
                    finduser.address.billing.pincode = pincode;
                }
            }
        }

        let updateProfile = await userModel.findByIdAndUpdate({ _id: userId }, finduser, { new: true });
        return res.status(200).send({ status: true, message: "User profile updated", data: updateProfile });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

