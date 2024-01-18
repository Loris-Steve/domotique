module.exports = app => {
  const telemetrys = require("../controllers/telemetry.controller.js");

  var router = require("express").Router();

  // Retrieve all Telemetrys
  router.get("/", telemetrys.findAll);

  app.use("/api/telemetries", router);

};
