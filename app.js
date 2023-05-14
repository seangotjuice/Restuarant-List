const express = require("express");
const methodOverride = require("method-override");
const exphbs = require("express-handlebars");
const routes = require("./routes");
require("./config/mongoose");
const app = express();

// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // 取得資料庫連線狀態
// const db = mongoose.connection;
// // 連線異常
// db.on("error", () => {
//   console.log("mongodb error!");
// });
// // 連線成功
// db.once("open", () => {
//   console.log("mongodb connected!");
// });

const port = 3000;

// express-handlebars

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // body-parser
app.use(methodOverride("_method"));
app.use(routes);

////////////////////////////////////////

// // -----瀏覽全部餐廳-----
// app.get("/", (req, res) => {
//   Restaurant.find({})
//     .lean()
//     .then((rest) => res.render("index", { rest }))
//     .catch((err) => console.log(err));
// });
// // ----------新增餐廳-----------
// // 為何(這route必須寫在 "瀏覽一個" 前面)，放在搜尋後面跑不動
// app.get("/restaurants/new", (req, res) => {
//   return res.render("new");
// });

// // 更新新增
// app.post("/restaurants", (req, res) => {
//   return Restaurant.create(req.body)
//     .then(() => res.redirect("/"))
//     .catch((err) => console.log(err));
// });

// // ----------瀏覽一筆----------
// app.get("/restaurants/:restaurantId", (req, res) => {
//   const { restaurantId } = req.params;
//   Restaurant.findById(restaurantId)
//     .lean()
//     .then((rest) => res.render("show", { rest }))
//     .catch((err) => {
//       console.log(err);
//     });
// });

// // ----------搜尋----------
// app.get("/search", (req, res) => {
//   if (!req.query.keyword) {
//     return res.redirect("/");
//   }

//   const keyword = req.query.keyword;

//   Restaurant.find({})
//     .lean()
//     .then((restData) => {
//       const rest = restData.filter(
//         (r) =>
//           r.name.toLowerCase().includes(keyword.toLowerCase()) ||
//           r.category.includes(keyword.toLowerCase())
//       );
//       res.render("index", { rest, keyword: keyword });
//     })
//     .catch((err) => console.log(err));
// });

// // ----------編輯餐廳----------
// app.get("/restaurants/:restaurantId/edit", (req, res) => {
//   const { restaurantId } = req.params;
//   Restaurant.findById(restaurantId)
//     .lean()
//     .then((restaurantData) => {
//       res.render("edit", { restaurantData });
//     })
//     .catch((err) => console.log(err));
// });

// // 更新編輯
// app.put("/restaurants/:restaurantId", (req, res) => {
//   const { restaurantId } = req.params;
//   const data = req.body; // 取得使用者輸入資料

//   return Restaurant.findById(restaurantId)
//     .then((resolve) => {
//       // console.log(resolve);
//       resolve.name = data.name;
//       resolve.name_en = data.name_en;
//       resolve.category = data.category;
//       resolve.image = data.image;
//       resolve.location = data.location;
//       resolve.phone = data.phone;
//       resolve.google_map = data.google_map;
//       resolve.rating = data.rating;
//       resolve.description = data.description;
//       resolve.save();
//     })
//     .then(() => {
//       res.redirect(`/restaurants/${restaurantId}`);
//     })
//     .catch((err) => console.log(err));
// });

// // ----------刪除----------
// app.delete("/restaurants/:restaurantId", (req, res) => {
//   const { restaurantId } = req.params;

//   Restaurant.findById(restaurantId)
//     .then((rest) => {
//       rest.remove();
//     })
//     .then(() => res.redirect("/"))
//     .catch((err) => console.log(err));
// });
////////////////////////////////////////
app.listen(port, () => {
  console.log("express is running yay");
});
