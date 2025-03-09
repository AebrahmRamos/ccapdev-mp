const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    cafeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cafe',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        ambiance: Number,
        drinkQuality: Number,
        service: Number,
        wifiReliability: Number,
        cleanliness: Number,
        valueForMoney: Number,
    },
    textReview: String,
    photos: [String],
    videos: [String],
    date: {
        type: Date,
        default: Date.now,
    },
});

// reviewSchema.index({ cafeId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);