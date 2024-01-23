const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionsSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "posts",
    required: true,
  },
  choice: {
    type: Array,
  },
  answer: {
    type: Array,
  },
  attachments: {
    type: String,
  },
});

module.exports = mongoose.model("questions", QuestionsSchema);
