const DataType = require("./src/models/tempmodel.js");
const myfunctions = require("./src/function2.js");
const { ok } = require("assert");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const ejs = require('ejs');
//connect to database
mongoose.connect("mongodb://localhost:27017/bdtemp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();

// express configuration
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.set("view engine", 'ejs');
// app.use(express.static(__dirname + "/public"));

// UTILISATION DE ANGULAR MAINTENANT POUR LA VUE

app.get("/api/temp", async function (req, res) {
  // let maList = await myfunctions.getData();
  let datas;
  await DataType.TemperatureData.find(function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      datas = result;
      //   return result;
    }
  });
  console.log(datas);
  res.json(datas);
  // res.redirect('/dashboard');
});

app.post("/api/temp", function (req, res) {
  // console.log(req.body);
  let kk = req.body;
  let date = new Date();
  kk.date = date;
  kk.dateString = date.toLocaleDateString();
  kk.heure = date.toLocaleTimeString();
  console.log(kk);
  // body est un objet JSON envoyer depuis esp 12
  let data = new DataType.TemperatureData(req.body);
  data.save().then(
    () => {
      console.log("hello");
    },
    (reason) => {
      console.log("Error", reason);
    }
  );
  // myfunctions.saveData(req.body);
  res.json(kk);
});

app
  .route("/api/statistiques")
  .get(async function (req, res) {})
  .post(async function (req, res) {
    console.log(req.body);
    let resulats;
    await DataType.TemperatureData.find(
      {
        date: { $gt: req.body.dateDebut, $lt: req.body.dateFin },
      },
      function (err, result) {
        if (err) throw err;
        console.log(result);
        resulats = result;
      }
    );
    res.json(resulats);
  });

app.listen(3000, function () {
  console.log("***SERVER STARTED*** (*-*) ON PORT 3000");
});
