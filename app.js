const express = require("express");
const mongoose = require("mongoose");

const app = express();

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

// CSS
app.use(express.static("public"));

// -------路由設定-------

// 首頁
app.get("/", (req, res) => {
  //   res.send("this is my restaurant");

  res.render("index", { rest: restaurantList.results });
});

// 資訊
app.get("/restaurants/:rest_id", (req, res) => {
  const restaurant = restaurantList.results.find(
    (el) => el.id === Number(req.params.rest_id)
  );
  res.render("show", { rest: restaurant });
});

// 搜尋
app.get("/search", (req, res) => {
  const keyword = req.query.keyword;
  const rest = restaurantList.results.filter((r) => {
    return r.name.toLowerCase().includes(keyword.toLowerCase());
  });
  res.render("index", { rest, keyword });
});

app.listen(port, () => {
  console.log("express is running yay");
});
