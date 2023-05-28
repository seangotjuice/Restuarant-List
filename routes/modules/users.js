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
  const errors = [];
  const { name, email, password, confirmPassword } = req.body;
  if (!email || !password || !confirmPassword) {
    console.log("都要填");
    errors.push({ message: "所有欄位都是必填" });
  }
  if (password !== confirmPassword) {
    console.log("password不符");
    errors.push({ message: "密碼與確認密碼不符" });
  }
  if (errors.length) {
    console.log("errorslength");
    // 保留使用者輸入的表單內容
    return res.render("register", {
      errors,
      name,
      email,
      password,
      confirmPassword,
    });
  }
  User.findOne({ email }).then((user) => {
    if (user) {
      errors.push({ message: "已經註冊過" });
      // console.log("already registered");
      // 停在原頁面，但保留使用者輸入的表單內容
      return res.render("register", {
        errors,
        name,
        email,
        password,
        confirmPassword,
      });
    }
    return User.create({ name: name || "No Name", email, password })
      .then(() => res.redirect("/"))
      .catch((err) => console.log(err));
  });
});
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "你已經成功登出！");
  res.redirect("/users/login");
});

module.exports = router;
