const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListStudentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "posts",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("list_students", ListStudentSchema);
