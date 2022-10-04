const express = require("express")
const mongoose= require("mongoose")
const route = require("./routes/route")
const bodyParser = require("body-parser")
const app = express()
const multer =require("multer");
const aws =require("aws-sdk");

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(multer().any())

const url = "mongodb+srv://NishantGautam:Ng123@cluster0.45vj3.mongodb.net/group41Database"

mongoose.connect(url, {useNewUrlParser: true})
.then(()=> console.log("Mongodb is connected "))
.catch((err)=> console.log(err))

app.use("/", route)

app.listen(process.env.PORT||3000, function(){
    console.log("Express is running on port" +(process.env.PORT||3000))
})