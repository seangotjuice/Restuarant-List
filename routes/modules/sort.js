const express = require("express");
const router = express.Router();
const Restaurant = require("../../models/rest");

router.get("/sort/asc", (res, req) => {
  Restaurant.find()
    .lean()
    .then((res) => console.log(res))
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

module.exports = router;
