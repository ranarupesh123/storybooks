const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
const MongoStore = require("connect-mongo")(session);
const app = express();

//* Load config
dotenv.config({ path: "./config/config.env" });
const connectDB = require("./config/db");

//* passport config
require("./config/passport")(passport);

const PORT = process.env.PORT || 5000;

connectDB();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

//* Handlebars
app.engine(".hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

//* Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);
//* passport middleware
app.use(passport.initialize());
app.use(passport.session());

//* Static Folder
app.use(express.static(path.join(__dirname, "public")));

//* routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
