require("dotenv").config()
const cors = require("cors")
const express = require("express")
const mongoose = require("mongoose")
const fileUpload = require("express-fileupload")
const UserModel = require("./Schema/userSchema")
const PostModel = require("./Schema/postSchema")
const cloudinary = require("./utils/cloudinary")

const app = express()
const port = process.env.PORT || 5000

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://media-lab-ee257.web.app');
  // You can also specify other CORS headers as needed
  // res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  // res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})
app.use(fileUpload())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// ROUTES
app.post("/api/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await UserModel.find({ email, password })
    res.status(200).send(user)
  } catch (error) {
    res.status(400).send(error)
  }
})

app.get('/api/users', async (req, res) => {
  try {
    const users = await UserModel.find()
    res.status(200).send(users)
  } catch (error) {
    res.status(400).send(error)
  }
})

app.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id)
    res.status(200).send(user)
  } catch (error) {
    res.status(400).send(error)
  }
})

app.get("/api/usersmail/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await UserModel.find({ email })
    res.status(200).send(user)
  } catch (error) {
    res.status(400).send(error)
  }
})

app.post("/api/checkUser", async (req, res) => {
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;

  try {
    const user = await UserModel.find({ email })
    if (user.length === 0) {
      const user = await UserModel.find({ phoneNumber })
      res.status(200).send(user)
    } else {
      res.status(200).send(user)
    }
  } catch (error) {
    res.status(400).send(error)
  }
})

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
})

app.post("/api/updateProfile", async (req, res) => {
  const id = req.body.id;

  if (req.body.profileImg !== undefined) {
    const profileImg = req.body.profileImg;
    const fullname = req.body.fullname;
    const social = {
      fbLink: req.body.fbLink,
      igLink: req.body.igLink
    }

    try {
      const user = await UserModel.findByIdAndUpdate(id, { profileImg, fullname, social }, { new: true })
      res.status(200).send(user)
    } catch (error) {
      res.status(400).send(error);
    }
  } else if (req.body.chips) {
    const chips = req.body.chips;

    try {
      const user = await UserModel.findByIdAndUpdate(id, { chips }, { new: true })
      res.status(200).send(user)
    } catch (error) {
      res.status(400).send(error);
    }
  } else if (req.body.verified) {
    try {
      const user = await UserModel.findByIdAndUpdate(id, { verified: req.body.verified }, { new: true })
      res.status(200).send(user)
    } catch (error) {
      res.status(400).send(error);
    }
  } else {
    try {
      const fullname = req.body.fullname;
      const social = {
        fbLink: req.body.fbLink,
        igLink: req.body.igLink
      }
      const user = await UserModel.findByIdAndUpdate(id, { fullname, social }, { new: true })
      res.status(200).send(user)
    } catch (error) {
      res.status(400).send(error);
    }
  }
})

app.post("/api/createPost", async (req, res) => {
  const email = req.body.email;
  const postImg = req.body.postImg
  const public_id = req.body.public_id
  try {
    const newPost = new PostModel({ email, postImg, public_id })
    const savedPost = await newPost.save()
    res.status(201).send(savedPost)
  } catch (error) {
    res.status(400).send(error)
  }
})

app.get("/api/allPosts", async (req, res) => {
  try {
    const allPosts = await PostModel.find()
    res.status(200).send(allPosts)
  } catch (error) {
    res.status(400).send(error)
  }
})

app.post("/api/deletePost", async (req, res) => {
  const postId = req.body.postId
  const public_id = req.body.public_id

  try {
    await cloudinary.uploader.destroy(public_id)
    const allPosts = await PostModel.findByIdAndDelete(postId)
    res.status(200).send(allPosts)
  } catch (error) {
    res.status(400).send(error)
  }
})

app.post("/api/likePost", async (req, res) => {
  const likedPostId = req.body.likedPost
  const likedBy = req.body.likedBy
  try {
    let post = {}
    post = await PostModel.findByIdAndUpdate(likedPostId, { $push: { likes: likedBy } }, { new: true })
    post = await PostModel.findByIdAndUpdate(likedPostId, { $pull: { dislikes: likedBy } }, { new: true })
    res.status(200).send(post)
  } catch (error) {
    res.status(400).send(error)
  }
})

app.post("/api/dislikePost", async (req, res) => {
  const dislikedPostId = req.body.dislikedPost
  const dislikedBy = req.body.dislikedBy
  try {
    let post = {}
    post = await PostModel.findByIdAndUpdate(dislikedPostId, { $push: { dislikes: dislikedBy } }, { new: true })
    post = await PostModel.findByIdAndUpdate(dislikedPostId, { $pull: { likes: dislikedBy } }, { new: true })
    res.status(200).send(post)
  } catch (error) {
    res.status(400).send(error)
  }
})

app.post("/api/followUser", async (req, res) => {
  const followBy = req.body.followBy
  const following = req.body.following

  try {
    await UserModel.findByIdAndUpdate(following, { $push: { followers: followBy } }, { new: true })
    await UserModel.findByIdAndUpdate(followBy, { $push: { following: following } }, { new: true })
    res.status(200).send({ "followed": true })
  } catch (error) {
    res.status(400).send(error)
  }
})

app.post("/api/unFollowUser", async (req, res) => {
  const unFollowBy = req.body.unFollowBy
  const unFollowing = req.body.unFollowing

  try {
    await UserModel.findByIdAndUpdate(unFollowing, { $pull: { followers: unFollowBy } }, { new: true })
    await UserModel.findByIdAndUpdate(unFollowBy, { $pull: { following: unFollowing } }, { new: true })
    res.status(200).send({ "unfollowed": true })
  } catch (error) {
    res.status(400).send(error)
  }
})

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
