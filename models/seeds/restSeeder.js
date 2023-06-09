const Rest = require("../rest");
const mongoose = require("mongoose");
const restList = require("../../restaurant.json").results;

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
  console.log("running restSeeder.js...");
  Rest.create(restList)
    .then(() => {
      console.log("restSeeder done!");
      db.close();
    })
    .catch((err) => console.log(err));
});
