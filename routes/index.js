// 總路由器
const express = require("express");
const router = express.Router();
const home = require("./modules/home");
const restaurants = require("./modules/restaurants");

// 如果request 路徑是___, 就去執行____.
router.use("/", home);
router.use("/restaurants", restaurants);

module.exports = router;
