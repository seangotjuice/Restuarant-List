const express = require("express");
const router = express.Router();
const Restaurant = require("../../models/rest");

// 1. 將 app 改成 router
// 2. 把路由的前綴詞 /todos 刪掉，這一段已經在總路由器檢查完畢

// ----------新增餐廳-----------
// Ｑ：為何此功能兩個route必須寫在 "瀏覽一筆" 前面，放在搜尋後面會跑不動
router.get("/new", (req, res) => {
  return res.render("new");
});

// 更新新增
router.post("", (req, res) => {
  return Restaurant.create(req.body)
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

// ----------排序----------
router.get("/name/:ascOrDesc", (req, res) => {
  const { ascOrDesc } = req.params;
  Restaurant.find()
    .lean()
    .sort({ name: ascOrDesc })
    .then((rest) => res.render("index", { rest }))
    .catch((err) => console.log(err));
});
router.get("/category/asc", (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ category: "asc" })
    .then((rest) => res.render("index", { rest }))
    .catch((err) => console.log(err));
});
router.get("/location/asc", (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ location: "asc" })
    .then((rest) => res.render("index", { rest }))
    .catch((err) => console.log(err));
});

// ----------瀏覽一筆----------
router.get("/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;
  Restaurant.findById(restaurantId)
    .lean()
    .then((rest) => res.render("show", { rest }))
    .catch((err) => {
      console.log(err);
    });
});

// ----------編輯餐廳----------
router.get("/:restaurantId/edit", (req, res) => {
  const { restaurantId } = req.params;
  Restaurant.findById(restaurantId)
    .lean()
    .then((restaurantData) => {
      res.render("edit", { restaurantData });
    })
    .catch((err) => console.log(err));
});

// 更新編輯
router.put("/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;
  const data = req.body; // 取得使用者輸入資料

  return Restaurant.findById(restaurantId)
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
      res.redirect(`/restaurants/${restaurantId}`);
    })
    .catch((err) => console.log(err));
});

// ----------刪除----------
router.delete("/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;

  Restaurant.findById(restaurantId)
    .then((rest) => {
      rest.remove();
    })
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

module.exports = router;
