const express = require("express");
const router = express.Router();
const Restaurant = require("../../models/rest");

// ----------搜尋----------
router.get("/", (req, res) => {
  if (!req.query.keyword) {
    return res.redirect("/");
  }

  const keyword = req.query.keyword;

  Restaurant.find({})
    .lean()
    .then((restData) => {
      const rest = restData.filter(
        (r) =>
          r.name.toLowerCase().includes(keyword.toLowerCase()) ||
          r.category.includes(keyword.toLowerCase())
      );
      res.render("index", { rest, keyword: keyword });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
