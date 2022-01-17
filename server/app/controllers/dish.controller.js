const db = require("../models");
const Dish = db.dishes;


exports.create = (req, res) => {
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const dish = new Dish({
    title: req.body.title,
    qty:req.body.qty,
    category:req.body.category,
    type:req.body.type,
    cuisine:req.body.cuisine,
    inStock:req.body.inStock,
    ingredients:req.body.ingredients,
    ratings:req.body.ratings ? req.body.ratings : [],
    userRatings:req.body.userRatings ? req.body.userRatings : [],
    commentRatings:req.body.commentRatings ? req.body.commentRatings : [],
    commentWitoutRating:req.body.commentWitoutRating ? req.body.commentWitoutRating : [],
    userWitoutRating:req.body.userWitoutRating ? req.body.userWitoutRating : [],
    images:req.body.images ? req.body.images : []
  });

  dish
    .save(dish)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Dish."
      });
    });
};

exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Dish.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving dishs."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Dish.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Dish with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Dish with id=" + id });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Dish.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Dish with id=${id}. Maybe Dish was not found!`
        });
      } else res.send({ message: "Dish was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Dish with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Dish.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Dish with id=${id}. Maybe Dish was not found!`
        });
      } else {
        res.send({
          message: "Dish was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Dish with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  Dish.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Dishs were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all dishs."
      });
    });
};

exports.findAllPublished = (req, res) => {
  Dish.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving dishs."
      });
    });
};
