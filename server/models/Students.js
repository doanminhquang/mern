const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListStudentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "posts",
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("list_students", ListStudentSchema);
