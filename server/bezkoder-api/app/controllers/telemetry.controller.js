const db = require("../models");
const Telemetry = db.telemetrys;

exports.addTelemetry = (data) => {
    if(data.deviceName && data.value){

      const telemetry = new Telemetry({
      deviceName: data.deviceName,
      value: data.value
    });
    
    telemetry.save(telemetry)
    .then(savedTelemetry => {
      console.log(`Données insérées dans la base de données : ${savedTelemetry}`);
    })
    .catch(err => {
      console.error(`Erreur lors de l'insertion des données : ${err.message}`);
    });
  }
};


exports.findAll = (req, res) => {
  const deviceName = req.query.deviceName;
  var condition = deviceName ? { deviceName: { $regex: new RegExp(deviceName), $options: "i" } } : {};
console.log("enter find all telemetry");
  Telemetry.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving telemetrys."
      });
    });
};
