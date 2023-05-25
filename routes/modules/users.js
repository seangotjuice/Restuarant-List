const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const passport = require("passport");

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
  })
);

router.get("/register", (req, res) => {
  res.render("register");
});
router.post("/register", (req, res) => {
  const { name, email, password, confirmpassword } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      console.log("already registered");
      // 停在原頁面，但保留使用者輸入的表單內容
      res.render("register", {
        name,
        email,
        password,
        confirmpassword,
      });
    } else {
      return User.create({ name: name || "No Name", email, password })
        .then(() => res.redirect("/"))
        .catch((err) => console.log(err));
    }
  });
});

module.exports = router;
