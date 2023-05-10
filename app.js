const express = require("express");
const mongoose = require("mongoose");
// const methodOverride = require("method-override");
const Restaurant = require("./models/rest");
const app = express();
// const bodyParser = require("body-parser");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 取得資料庫連線狀態
const db = mongoose.connection;
// 連線異常
db.on("error", () => {
  console.log("mongodb error!");
});
// 連線成功
db.once("open", () => {
  console.log("mongodb connected!");
});

const port = 3000;

// express-handlebars
const exphbs = require("express-handlebars");
const restaurantList = require("./restaurant.json");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // added
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(methodOverride("_method")); // added

////////////////////////////////////////

// -----瀏覽全部餐廳-----
app.get("/", (req, res) => {
  Restaurant.find({})
    .lean()
    .then((rest) => res.render("index", { rest }))
    .catch((err) => console.log(err));
});
// ----------資訊----------
app.get("/restaurants/:restaurantId/detail", (req, res) => {
  const { restaurantId } = req.params;
  Restaurant.findById(restaurantId)
    .lean()
    .then((rest) => res.render("show", { rest }))
    .catch((err) => {
      console.log(err);
    });
});

// ----------搜尋----------
app.get("/search", (req, res) => {
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

// ----------新增餐廳-----------
app.get("/restaurants/new", (req, res) => {
  res.render("new");
});

// 更新新增
app.post("/restaurants/create", (req, res) => {
  return Restaurant.create(req.body)
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

// ----------編輯餐廳----------
app.get("/restaurants/:restaurantId/edit", (req, res) => {
  const { restaurantId } = req.params;
  Restaurant.findById(restaurantId)
    .lean()
    .then((restaurantData) => {
      res.render("edit", { restaurantData });
    })
    .catch((err) => console.log(err));
});

// 更新編輯
app.post("/restaurants/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;
  const data = req.body; // 取得使用者輸入資料

  // default image
  if (data.image === "") {
    data.image =
      "https://media.istockphoto.com/id/1372294434/photo/folded-white-napkins-on-table-mat-stainless-steel-knives-forks-and-crystal-drinking-glasses.jpg?s=1024x1024&w=is&k=20&c=SMi5S1mcyeHC0W8BdW7GZpmTTl6zfEzoZcl22863fog=";
  }

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
      res.redirect(`/restaurants/${restaurantId}/detail`);
    })
    .catch((err) => console.log(err));
});

// ----------刪除----------
app.get("/restaurants/:restaurantId/delete", (req, res) => {
  const { restaurantId } = req.params;

  Restaurant.findById(restaurantId)
    .then((rest) => {
      rest.remove();
    })
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});
////////////////////////////////////////
app.listen(port, () => {
  console.log("express is running yay");
});
