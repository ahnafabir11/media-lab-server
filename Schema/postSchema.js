const { Schema, model } = require('mongoose')

const postSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  postImg: {
    type: Object,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: new Date(),
  },
  likes: {
    type: Array,
    default: []
  },
  dislikes: {
    type: Array,
    default: []
  }
})

const PostModel = model('all_posts', postSchema);

module.exports = PostModel;