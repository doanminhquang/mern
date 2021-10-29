const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostDetailsSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  video: {
    type: String,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "posts",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("post_details", PostDetailsSchema);
