const express = require("express");
const session = require("express-session");
const methodOverride = require("method-override");
const exphbs = require("express-handlebars");
const routes = require("./routes");
require("./config/mongoose");
const app = express();
const usePassport = require("./config/passport");
const flash = require("connect-flash");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// const port = 3000;
const PORT = process.env.PORT || 3000;

// express-handlebars

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // body-parser
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "thisismysecret",
    resave: false,
    saveUninitialized: true,
  })
);
usePassport(app);
app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.warning_msg = req.flash("warning_msg");
  next();
});
app.use(routes);

////////////////////////////////////////
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
