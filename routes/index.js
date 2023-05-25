// 總路由器
const express = require("express");
const router = express.Router();
const home = require("./modules/home");
const restaurants = require("./modules/restaurants");
const search = require("./modules/search");
const users = require("./modules/users");

// 如果request 路徑是___, 就去執行____.
router.use("/", home);
router.use("/restaurants", restaurants);
router.use("/search", search);
router.use("/users", users);

module.exports = router;
