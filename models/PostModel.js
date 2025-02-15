const { default: mongoose } = require("mongoose");

const postSchema = new mongoose.Schema({
  text: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  socialApp: {
    type: String,
    required: false,
    enum: ["facebook", "twitter", "instagram", "linkedin"],
  },
  user: {
    type: Number,
    required: true,
    ref: "user",
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "posted"],
    default: "pending",
  },
});

const PostModel = mongoose.model("post", postSchema);
module.exports = PostModel;
