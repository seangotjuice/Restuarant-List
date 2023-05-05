const express = require("express");
const mongoose = require("mongoose");
// const methodOverride = require("method-override");
const Restaurant = require("./models/rest");
const app = express();
const bodyParser = require("body-parser");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

mongoose.connect(process.env.MONGODB_URI); // 設定連線到 mongoDB
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
app.use(bodyParser.urlencoded({ extended: true }));
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

// 搜尋
app.get("/search", (req, res) => {
  const keyword = req.query.keyword;
  const rest = restaurantList.results.filter((r) => {
    return r.name.toLowerCase().includes(keyword.toLowerCase());
  });
  res.render("index", { rest, keyword });
});

// ----------新增餐廳-----------
app.get("/restaurants/new", (req, res) => {
  res.render("new");
});

// 更新新增（？）
app.post("/restaurants/create", (req, res) => {
  Restaurant.create(req.body)
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

// 更新編輯（???）
app.get("/restaurants/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;
  console.log("req.query", req.query); // 得到使用者輸入
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
  } = req.query;
  Restaurant.findByIdAndUpdate(restaurantId, req.body)
    .then((resolve) => {
      // console.log(resolve); // 得到資料

      // 全部修改(如何更有效率？)
      resolve.name = name;
      resolve.name_en = name_en;
      resolve.category = category;
      resolve.image = image;
      resolve.location = location;
      resolve.phone = phone;
      resolve.google_map = google_map;
      resolve.rating = rating;
      resolve.description = description;

      res.redirect(`/restaurants/${restaurantId}/detail`);
      return resolve.save();
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
