const mongoose = require("mongoose")
const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")
const validator = require('../validator/validator')

//================================================Create interns details======================================================
const createInternDetails = async function (req, res) {


    try {

        let internData = { name, mobile, email, collegeName, collegeId } = req.body

        


        if (Object.keys(internData).length == 0) return res.status(400).send({ status: false, msg: "Please enter some data" })



     
       

        if (!validator.isValid(name)) {
            return res.status(400).send({ status: false, msg: "name required " })
        }


        if (!/[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/.test(name)) {
            return res.status(400).send({ status: false, message: ` ${name} please enter name in character, ex:ram` });
        }


        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, msg: "email required " })
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return res.status(400).send({ status: false, message: `Please enter valid email address ex:rohan123@gmail.com` });
        }


        const checkEmailId = await internModel.findOne({ email: email });
        if (checkEmailId) {
            return res.status(400).send({ status: false, msg: ` ${email} email already exists please enter another another email` })
        }

        if (!validator.isValid(mobile)) {
            return res.status(400).send({ status: false, msg: "mobile required " })
        }

        const checkMobileNumber = await internModel.findOne({ mobile: mobile });
        if (checkMobileNumber) {
            return res.status(400).send({ status: false, msg: ` ${mobile} mobile number  already exist please enter another mobile number` })
        }

       


        if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(mobile)) {
            return res.status(400).send({ status: false, message: ` Please enter valid mobile number` });
        }

        if (!validator.isValid(collegeName)) {
            return res.status(400).send({ status: false, msg: " college name is required " });

        }


        const nameInLowerCase = internData.collegeName.toLowerCase().trim()

        const findCollege = await collegeModel.findOne({ name: nameInLowerCase, isDeleted: false })//how to hide id
        if (!findCollege) {
            return res.status(400).send({ status: false, data: "college not exists" })

        }

        internData.collegeId = findCollege._id

        const saveData = await internModel.create(internData)

        const saveFinalData = await internModel.find(internData).select({_id:0})
        return res.status(201).send({ status: true, msg: saveFinalData })
    }
      


    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

//================================================Create interns details======================================================

module.exports.createInternDetails = createInternDetails;