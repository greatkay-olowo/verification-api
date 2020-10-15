const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("morgan");
const compression = require("compression");
const app = express();
app.use(helmet());

require("dotenv").config();

const port = process.env.PORT || 5000;

// setup middleware
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(logger("combined"));

// connect to the database
const mongoDB = process.env.ATLAS_URI;
mongoose
  .connect(mongoDB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.error("An error has occured", err));
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// auth middleware
const authentication = require("./utils/auth");
app.use(authentication);

// routes
const UserRouter = require("./routes/user.route");

// middleware
app.use("/user", UserRouter);

app.get("/", (req, res) => {
  res.send("Welcome to this api.");
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
