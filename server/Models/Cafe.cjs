const mongoose = require('mongoose');

const cafeSchema = new mongoose.Schema({
    cafeName: {
        type: String,
        required: true,
        unique: true,
    },
    category: {
        type: String,
        enum: ['Cafe', 'Coffee Shop', 'Dessert Cafe'],
        required: true,
    },
    totalReviews: {
        type: Number,
        default: 0,
    },
    averageReview: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    address: {
        type: String,
        required: true,
    },
    operatingHours: {
        Monday: String,
        Tuesday: String,
        Wednesday: String,
        Thursday: String,
        Friday: String,
        Saturday: String,
        Sunday: String,
    },
    photos: [String],
    userReviews: [
        {
            user: String,
            rating: Number,
            comment: String,
            date: Date,
            ambiance: String,
            pricing: String,
            wifi: String,
            outlets: String,
            seating: String,
        },
    ],
    slug: {
        type: String,
        required: true,
        unique: true,
    },
}, { collection: 'cafes' });

module.exports = mongoose.model('Cafe', cafeSchema);
