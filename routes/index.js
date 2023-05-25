// 總路由器
const express = require("express");
const router = express.Router();
const home = require("./modules/home");
const restaurants = require("./modules/restaurants");
const search = require("./modules/search");
const users = require("./modules/users");
const { authenticator } = require("../middleware/auth");

// 如果request 路徑是___, 就去執行____.
router.use("/restaurants", authenticator, restaurants);
router.use("/search", authenticator, search);
router.use("/users", users);
router.use("/", authenticator, home);

module.exports = router;
