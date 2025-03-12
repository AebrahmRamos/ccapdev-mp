const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  cafeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cafe',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    ambiance: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    drinkQuality: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    service: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    wifiReliability: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    cleanliness: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    valueForMoney: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    }
  },
  textReview: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000
  },
  photos: [{
    type: String  // URLs to photos stored in cloud storage
  }],
  videos: [{
    type: String  // URLs to videos stored in cloud storage
  }],
  date: {
    type: Date,
    default: Date.now
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  }
});

// Virtual property to calculate average rating
reviewSchema.virtual('averageRating').get(function() {
  const ratings = this.rating;
  const values = Object.values(ratings);
  return values.reduce((acc, val) => acc + val, 0) / values.length;
});

// Enable virtuals when converting to JSON
reviewSchema.set('toJSON', { virtuals: true });
reviewSchema.set('toObject', { virtuals: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;