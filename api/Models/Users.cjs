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
      default: "https://cdn-icons-png.flaticon.com/512/147/147285.png",
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
