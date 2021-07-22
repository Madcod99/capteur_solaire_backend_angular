const schema = require('./data');
const TemperatureData = schema.mongoose.model("sensorData", schema.SensorData);

const optionsHeure = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
const optionsDate = { year: 'numeric', month: 'numeric', day: 'numeric' };

module.exports = { TemperatureData, optionsHeure, optionsDate}; 