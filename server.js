const DataType = require("./server/src/models/tempmodel");
// const myfunctions = require("./src/function2.js");
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
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));
// Local database URI.
const LOCAL_PORT = 8080;

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

//use by the esp32
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

app.listen(LOCAL_PORT, function () {
  console.log("***SERVER STARTED*** (*-*) ON PORT ", LOCAL_PORT);
});




    




// Errors handler.
function manageError(res, reason, message, code) {
    console.log("Error: " + reason);
    res.status(code || 500).json({ "error": message });
}
