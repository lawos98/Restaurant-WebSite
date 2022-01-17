
module.exports = app => {
  const dishes = require("../controllers/dish.controller.js");

  var router = require("express").Router();

  router.post("/", dishes.create);

  router.get("/", dishes.findAll);

  router.get("/published", dishes.findAllPublished);

  router.get("/:id", dishes.findOne);

  router.put("/:id", dishes.update);

  router.delete("/:id", dishes.delete);

  router.delete("/", dishes.deleteAll);

  app.use("/api/dishs", router);

};
