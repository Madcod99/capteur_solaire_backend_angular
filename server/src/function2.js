const DataType = require("../src/models/tempmodel");

const fieldsIWant = [
  "date",
  "Tv1",
  "Tv2",
  "Tv3",
  "Tv4",
  "Tv5",
  "Tab1",
  "Tab2",
  "Tab3",
  "Tab4",
  "Tab5",
  "Te1",
  "Te2",
  "Te3",
  "Ts1",
  "Ts2",
  "Ts3",
  "He1",
  "He2",
  "He3",
  "He4",
  "He5",
  "He6",
];

function saveData(myData) {
  let date = new Date();

  DataType.TemperatureData({
    date: date,

    Tv1: myData["Tv1"],
    Tv2: myData["Tv2"],
    Tv3: myData["Tv3"],
    Tv4: myData["Tv4"],
    Tv5: myData["Tv5"],

    Tab1: myData["Tab1"],
    Tab2: myData["Tab2"],
    Tab3: myData["Tab3"],
    Tab4: myData["Tab4"],
    Tab5: myData["Tab5"],

    Te1: myData["Te1"],
    Te2: myData["Te2"],
    Te3: myData["Te3"],

    Ts1: myData["Ts1"],
    Ts2: myData["Ts2"],
    Ts3: myData["Ts3"],

    He1: myData["He1"],
    He2: myData["He2"],
    He3: myData["He3"],
    He4: myData["He4"],
    He5: myData["He5"],
    He6: myData["He6"],
  }).save();
}

async function getData() {
  await DataType.TemperatureData.find({}, fieldsIWant, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      return result;
    }
  });
}

function filtreData(dateDebut, dateFin){
    // faire une requete avec les cond de date
}


module.exports = { getData, saveData, filtreData};
