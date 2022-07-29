const express = require('express');
const router = express.Router();

 const collegeController = require("../controller/collegeController")
 
 const internsController = require("../controller/internsController")



router.post('/functionup/colleges',collegeController.createCollege )

router.post('/functionup/interns',internsController.createInternDetails)

router.get('/functionup/collegeDetails',collegeController.getCollegeDeatails )

module.exports = router;
