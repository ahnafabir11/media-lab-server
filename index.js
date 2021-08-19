require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const UserModel = require("./Schema/userSchema");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ROUTES
app.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    res.status(302).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/api/add_user", async (req, res) => {
  const user = req.body;
  try {
    const newUser = new UserModel({
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      password: user.password,
    });
    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

// DATABASE CONNECTION
const dbuser = process.env.USER_NAME;
const dbpass = process.env.USER_PASS;
const dbname = process.env.DB_NAME;

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => app.listen(port));
