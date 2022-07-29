const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const  mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());



mongoose.connect("mongodb+srv://avenger:rajatrajat12@cluster0.wuyw0.mongodb.net/group52Database?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);

app.listen( 3000, function () {
    console.log('Express app running on port ' +  3000)
});


