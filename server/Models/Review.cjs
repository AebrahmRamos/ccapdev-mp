const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    cafeId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    rating: {
      ambiance: { type: Number, min: 1, max: 5, required: true },
      drinkQuality: { type: Number, min: 1, max: 5, required: true },
      service: { type: Number, min: 1, max: 5, required: true },
      wifiReliability: { type: Number, min: 1, max: 5, required: true },
      cleanliness: { type: Number, min: 1, max: 5, required: true },
      valueForMoney: { type: Number, min: 1, max: 5, required: true },
    },
    textReview: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 1000,
    },
    photos: [{ type: String }],
    videos: [{ type: String }],
    date: {
      type: Date,
      default: Date.now,
    },
    helpfulVotes: {
      type: Number,
      default: 0,
    },
    helpfulVoters: [{ type: String }], // Array of user IDs who have upvoted
  },
  {
    collection: "reviews",
  }
);

module.exports = mongoose.model("Review", reviewSchema);
