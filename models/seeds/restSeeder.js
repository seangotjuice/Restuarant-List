const Rest = require("../rest");
const User = require("../user");
const mongoose = require("mongoose");
const restList = require("../../restaurant.json").results;
const db = require("../../config/mongoose");
const bcrypt = require("bcryptjs");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const SEED_USER = {
  name: "root",
  email: "root@example.com",
  password: "12345678",
};

// 以下重寫 ：create user, create 10 筆餐廳種子資料 用promise.all

db.once("open", () => {
  bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(SEED_USER.password, salt))
    .then((hash) =>
      User.create({
        name: SEED_USER.name,
        email: SEED_USER.email,
        password: hash,
      })
    )
    .then((user) => {
      const userId = user._id;
      return Promise.all(
        Array.from({ length: 10 }, (_, i) =>
          Rest.create({
            name: `name-${i}`,
            description: "des",
            rating: 1,
            google_map: "www.google.com",
            phone: "0800",
            location: "www.google.com",
            image: `https://loremflickr.com/320/240/restaurant,food/?random=${
              Math.random() * 100
            }`,
            category: "category",
            name_en: "en",
            userId,
          })
        )
      );
    })
    .then(() => {
      console.log("done");
      process.exit();
    });
});

// db.once("open", () => {
//   bcrypt
//     .genSalt(10)
//     .then((salt) => bcrypt.hash("12345", salt))
//     .then((hash) => {
//       Rest.create({
//         name: "root",
//         email: "root@root.root",
//         password: hash,
//       });
//     })
//     .then(() => {
//       console.log("done");
//       process.exit();
//     });
// });

// module.exports = db;
