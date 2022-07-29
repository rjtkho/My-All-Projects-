const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")
const validator = require('../validator/validator')


//================================================Create College======================================================

const createCollege = async function (req, res) {
    try {

        let { name, fullName, logoLink } = req.body;

        let data = req.body


        if (Object.keys(data).length ==0) return res.status(400).send({ status: false, msg: "Please enter some data" })
       

        const nameInLowerCase = data.name.toLowerCase().trim()

        const checkName = await collegeModel.findOne({ name: nameInLowerCase });

        if (checkName) {
            return res.status(400).send({ status: false, msg: `${name}  name  already exist please enter another name` })
        }
        if (!validator.isValid(data.name)) {
            return res.status(400).send({ status: false, msg: "name required " })
        }


        if (!/^[a-zA-Z]+$/.test(data.name)) {
            return res.status(400).send({ status: false, message: ` ${name} please enter college name in character, ex:lnct` });
        }


        if (!data.fullName.trim()) {
            return res.status(400).send({ status: false, message: "fullName is required" })
        }

        if (!/[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/.test(data.fullName.trim())) {
            return res.status(400).send({ status: false, message: ` ${fullName}  please enter fullname in character, ex:National Insitute of Techonology` });
        }

        if (!data.logoLink.trim()) {
            return res.status(400).send({ status: false, msg: "logolink is required" })
        }

        if (!/^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)\??.*$/gmi .test(logoLink)) {
            return res.status(400).send({ status: false, msg: " Please provide valid  logolink " })
        }

        data.name = nameInLowerCase // reasign

        const collegeCreated = await collegeModel.create(req.body);
        return res.status(201).send({ status: true, data: collegeCreated, msg: "college Successfully Created" });


    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


//================================================Get College Deatails======================================================



const getCollegeDeatails = async function (req, res) {

    try {
        let collegeName = req.query.collegeName;

        if (!validator.isValid(collegeName)) {
            res.status(400).send({ status: false, msg: "Enter a College Name in the query parameter" });
            return
        }
        if(!Object.keys(collegeName)){
            res.status(400).send({ status: false, msg: "Enter a College Name in the query parameter" });
            return
        }
        
        collegeName = collegeName.toLowerCase()


        let findCollege = await collegeModel.findOne({ name: collegeName })
        if (!findCollege) return res.status(404).send({ status: false, msg: "No College Found" });


        let Intern = await internModel.find({ collegeId: findCollege }).select({ name: 1, email: 1, mobile: 1 });
        if (Intern.length == 0) {
            res.status(404).send({ status: false, msg: " No Intern Found" });
            return
        }
        let collegeAndAllIntern = {
            "name": findCollege.name,
            "fullName": findCollege.fullName,
            "logoLink": findCollege.logoLink,
            "interns": Intern
        }

        res.status(200).send({ data: collegeAndAllIntern })

    } catch (error) {
        
        res.status(500).send({ status: false, message: error.message })
    }
}




module.exports.getCollegeDeatails = getCollegeDeatails;
module.exports.createCollege = createCollege;
