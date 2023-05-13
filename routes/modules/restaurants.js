const express = require("express");
const router = express.Router();
const Restaurant = require("../../models/rest");

// 1. 將 app 改成 router
// 2. 把路由的前綴詞 /todos 刪掉，這一段已經在總路由器檢查完畢

// ----------新增餐廳-----------
// 為何(這route必須寫在 "瀏覽一個" 前面)，放在搜尋後面跑不動
router.get("/new", (req, res) => {
  return res.render("new");
});

// 更新新增
router.post("", (req, res) => {
  return Restaurant.create(req.body)
    .then(() => res.redirect("/"))
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

// ----------搜尋----------
router.get("/search", (req, res) => {
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
