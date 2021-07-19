// module data
const mongoose = require("mongoose");

let SensorData = mongoose.Schema({
  date: Date,
  
  Tv1: int,
  Tv2: int,
  Tv3: int,
  Tv4: int,
  Tv5: int,

  Tab1: int,
  Tab2: int,
  Tab3: int,
  Tab4: int,
  Tab5: int,

  Te1: int,
  Te2: int,
  Te3: int,

  Ts1: int,
  Ts2: int,
  Ts3: int,

  He1: int,
  He2: int,
  He3: int,
  He4: int,
  He5: int,
  He6: int,
});

module.exports = { SensorData, mongoose };
