const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Wait", "Processing", "Done"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("contacts", ContactSchema);
