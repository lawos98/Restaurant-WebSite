const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

const dbConfig = require("../config/db.config.js");
db.url = dbConfig.url;
db.dishes= require("./dish.model.js")(mongoose);
db.globaldata=require("./globalData.model.js")(mongoose)

db.user = require("./user.model");
db.role = require("./role.model");

db.ROLES = ["user","ban","admin", "moderator"];

module.exports = db;
