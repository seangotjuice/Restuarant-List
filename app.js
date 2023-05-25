const express = require("express");
const session = require("express-session");
const methodOverride = require("method-override");
const exphbs = require("express-handlebars");
const routes = require("./routes");
require("./config/mongoose");
const app = express();

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
app.use(routes);

////////////////////////////////////////
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
