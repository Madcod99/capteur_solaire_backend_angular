// module data
const mongoose = require("mongoose");

let SensorData = mongoose.Schema({
  date: { type: Date },
  dateString :String,
  heure: String,
  lm35: {},
  dht: {},
});

module.exports = { SensorData, mongoose };
