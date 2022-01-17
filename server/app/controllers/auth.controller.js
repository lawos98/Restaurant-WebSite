const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    CartDishID: req.body.CartDishID ? req.body.CartDishID : [],
    CartCount: req.body.CartCount ? req.body.CartCount : [],
    dishHist:req.body.dishHist ? req.body.dishHist : [],
    price:req.body.price ? req.body.price: false,
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid Password!" });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push(user.roles[i].name);
      }

      req.session.token = token;

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        CartDishID:user.CartDishID,
        CartCount:user.CartCount,
        dishHist:user.dishHist,
        price:user.price,
      });
    });
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};

exports.update = (req, res) => {
  let rolesList=[]
  Role.find(
    {},
    (err, roles) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      for (let i = 0; i < roles.length; i++) {
        if (req.body.roles.includes(roles[i].name)){
          rolesList.push(roles[i]._id)
        }
      }
      User.findOneAndUpdate({username: req.body.username},{CartDishID:req.body.CartDishID,CartCount:req.body.CartCount,dishHist:req.body.dishHist,price:req.body.price,roles:rolesList},{ useFindAndModify: false })
        .then(data => {
          if (!data) {
            res.status(404).send({
              message: `Cannot update User with id=${req.body.id}. Maybe User was not found!`
            });
          } else res.send({ message: "User was updated successfully." });
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating User with id=" +req.body.id
          });
        });
    }
  );
};

exports.findAll = (req, res) => {
  User.find({})
    .then(data => {
      Role.find(
        {},
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          let dataResult=[]
          for(let i=0;i<data.length;i++){
            let temp=[]
            for(let j=0;j<roles.length;j++){
              if(data[i].roles.includes(roles[j]._id)){
                temp.push(roles[j].name)
              }
            }
            dataResult.push({
              id: data[i]._id,
              username: data[i].username,
              email: data[i].email,
              roles: temp,
              CartDishID:data[i].CartDishID,
              CartCount:data[i].CartCount,
              dishHist:data[i].dishHist,
              price:data[i].price,
            })
          }
          res.send(dataResult);
        })
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

