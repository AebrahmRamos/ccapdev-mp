const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
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
    cafeName: String,
    bio: String,
  },
  {
    collection: "users",
  }
);

module.exports = mongoose.model("User", userSchema);
