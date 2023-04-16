const express = require("express");
const app = express();

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
