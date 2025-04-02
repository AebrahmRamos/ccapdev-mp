const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: String,
  role: {
    type: String,
    enum: ['student', 'cafe_owner'],
    default: 'student',
  },
  preferences: {
    preferredAmbiance: String,
    preferredPriceRange: String,
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cafe',
    },
  ],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
});


// userSchema.index({ username: 1 }, { unique: true });
// userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
