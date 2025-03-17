const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstname: String,
    lastname: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    profilePicture: {
      type: String,
      default: "",
    },
    role: String,
    preferences: Object,
    favorites: Array,
    reviews: Array,
  },
  {
    collection: "users",
  }
);

module.exports = mongoose.model("User", userSchema);
