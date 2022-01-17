module.exports = app => {
  const globalData = require("../controllers/globalData.controller");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/",globalData.create);

  // Retrieve all Tutorials
  router.get("/",globalData.findAll);

  // Update a Tutorial with id
  router.put("/:id",globalData.update);

  app.use("/api/globaldata", router);

};
