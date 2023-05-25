const express = require("express");
const router = express.Router();
const Restaurant = require("../../models/rest");

// ----------新增餐廳-----------

router.get("/new", (req, res) => {
  return res.render("new");
});

// 更新新增
router.post("", (req, res) => {
  const {
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
  } = req.body;
  const userId = req.user._id;
  return Restaurant.create({
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
    userId,
  })
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

// ----------排序----------
router.get("/name/:ascOrDesc", (req, res) => {
  const userId = req.user._id;
  const { ascOrDesc } = req.params;
  Restaurant.find({ userId })
    .lean()
    .sort({ name: ascOrDesc })
    .then((rest) => res.render("index", { rest }))
    .catch((err) => console.log(err));
});
router.get("/category/asc", (req, res) => {
  const userId = req.user._id;

  Restaurant.find({ userId })
    .lean()
    .sort({ category: "asc" })
    .then((rest) => res.render("index", { rest }))
    .catch((err) => console.log(err));
});
router.get("/location/asc", (req, res) => {
  const userId = req.user._id;

  Restaurant.find({ userId })
    .lean()
    .sort({ location: "asc" })
    .then((rest) => res.render("index", { rest }))
    .catch((err) => console.log(err));
});

// ----------瀏覽一筆----------
router.get("/:restaurantId", (req, res) => {
  const userId = req.user._id;
  // const { restaurantId } = req.params;
  const _id = req.params.restaurantId;
  Restaurant.findOne({ _id, userId })
    .lean()
    .then((rest) => res.render("show", { rest }))
    .catch((err) => {
      console.log(err);
    });
});

// ----------編輯餐廳----------
router.get("/:restaurantId/edit", (req, res) => {
  const userId = req.user._id;
  const _id = req.params.restaurantId;

  Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurantData) => {
      res.render("edit", { restaurantData });
    })
    .catch((err) => console.log(err));
});

// 更新編輯
router.put("/:restaurantId", (req, res) => {
  const userId = req.user._id;
  const _id = req.params.restaurantId;
  const data = req.body; // 取得使用者輸入資料

  return Restaurant.findOne({ _id, userId })
    .then((resolve) => {
      // console.log(resolve);
      resolve.name = data.name;
      resolve.name_en = data.name_en;
      resolve.category = data.category;
      resolve.image = data.image;
      resolve.location = data.location;
      resolve.phone = data.phone;
      resolve.google_map = data.google_map;
      resolve.rating = data.rating;
      resolve.description = data.description;
      resolve.save();
    })
    .then(() => {
      res.redirect(`/restaurants/${_id}`);
    })
    .catch((err) => console.log(err));
});

// ----------刪除----------
router.delete("/:restaurantId", (req, res) => {
  const userId = req.user._id;
  const _id = req.params.restaurantId;

  Restaurant.findOne({ _id, userId })
    .then((rest) => {
      rest.remove();
    })
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

module.exports = router;
