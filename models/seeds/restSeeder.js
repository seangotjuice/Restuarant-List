const Rest = require("../rest");
const mongoose = require("mongoose");
const restList = require("../../restaurant.json").results;
const db = require("../../config/mongoose");
const bcrypt = require("bcryptjs");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

db.once("open", () => {
  bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash("12345", salt))
    .then((hash) => {
      Rest.create({
        name: "root",
        email: "root@root.root",
        password: hash,
      });
    })
    .then(() => {
      console.log("done");
      process.exit();
    });
});

module.exports = db;
