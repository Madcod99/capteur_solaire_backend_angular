const DataType = require('./src/models/tempmodel.js');
const myfunctions = require('./src/function2.js');
const { ok } = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
//connect to database
mongoose.connect('mongodb://localhost:27017/sensordata', { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();

 
// express configuration
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
// app.set("view engine", 'ejs');
// app.use(express.static(__dirname + "/public"));


// UTILISATION DE ANGULAR MAINTENANT POUR LA VUE

app.get('/data', async function (req, res) {
    let maList = await myfunctions.getData();
    // console.log(maList);
    res.json(maList)
    // res.redirect('/dashboard');
});

app.post('/data', function (req, res) {
    console.log(req.body);
    // body est un objet JSON envoyer depuis esp 12
    myfunctions.saveData(req.body);
    res.send('ok');
});


app.listen(3000, function () {
    console.log('***SERVER STARTED*** (*-*)');
})