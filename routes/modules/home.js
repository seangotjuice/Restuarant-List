const express = require("express");
const router = express.Router();
const Restaurant = require("../../models/rest");

// -----瀏覽全部餐廳-----
router.get("/", (req, res) => {
  Restaurant.find({})
    .lean()
    .then((rest) => res.render("index", { rest }))
    .catch((err) => console.log(err));
});

module.exports = router;
