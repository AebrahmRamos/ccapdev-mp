import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CafeDetails from '../components/CafeDetails';

const cafes = [
    {
        "id": 1,
        "cafeName": "The Coffee Bean & Tea Leaf",
        "totalReviews": 42,
        "averageReview": 4.5,
        "address": "G/F, Henry Sy Sr. Hall, De La Salle University, Taft Ave, Malate, Manila, 1004 Metro Manila",
        "operatingHours": {
            "Sunday": "8:00 AM - 8:00 PM",
            "Monday": "7:00 AM - 9:00 PM",
            "Tuesday": "7:00 AM - 9:00 PM",
            "Wednesday": "7:00 AM - 9:00 PM",
            "Thursday": "7:00 AM - 9:00 PM",
            "Friday": "7:00 AM - 9:00 PM",
            "Saturday": "8:00 AM - 8:00 PM"
        },
        "photos": [
            "images/cafe1.jpg",
            "images/cafe2.jpg",
            "images/cafe3.jpg"
        ],
        "userReviews": [
            {
                "user": "John Doe",
                "rating": 5,
                "comment": "Great coffee and atmosphere!",
                "date": "2024-01-15"
            },
            {
                "user": "Jane Smith",
                "rating": 4,
                "comment": "A bit pricey, but the quality is good.",
                "date": "2024-02-28"
            }
        ]
    },
    {
        "id": 2,
        "cafeName": "Starbucks",
        "totalReviews": 65,
        "averageReview": 4.2,
        "address": "2/F, De La Salle University - Manila, Taft Ave, Malate, Manila, 1004 Metro Manila",
        "operatingHours": {
            "Sunday": "8:00 AM - 9:00 PM",
            "Monday": "7:30 AM - 10:00 PM",
            "Tuesday": "7:30 AM - 10:00 PM",
            "Wednesday": "7:30 AM - 10:00 PM",
            "Thursday": "7:30 AM - 10:00 PM",
            "Friday": "7:30 AM - 10:00 PM",
            "Saturday": "8:00 AM - 9:00 PM"
        },
        "photos": [
            "cafe4.jpg",
            "cafe5.jpg"
        ],
        "userReviews": [
            {
                "user": "Alice Johnson",
                "rating": 4,
                "comment": "Love their seasonal drinks!",
                "date": "2023-12-25"
            },
            {
                "user": "Bob Williams",
                "rating": 4,
                "comment": "Always a reliable choice.",
                "date": "2024-01-08"
            }
        ]
    },
    {
        "id": 3,
        "cafeName": "Bo's Coffee",
        "totalReviews": 30,
        "averageReview": 4.3,
        "address": "Robinsons Place Manila, Pedro Gil St, Ermita, Manila, 1000 Metro Manila",
        "operatingHours": {
            "Sunday": "8:00 AM - 9:00 PM",
            "Monday": "7:00 AM - 10:00 PM",
            "Tuesday": "7:00 AM - 10:00 PM",
            "Wednesday": "7:00 AM - 10:00 PM",
            "Thursday": "7:00 AM - 10:00 PM",
            "Friday": "7:00 AM - 10:00 PM",
            "Saturday": "8:00 AM - 9:00 PM"
        },
        "photos": [
            "cafe6.jpg",
            "cafe1.jpg"
        ],
        "userReviews": [
            {
                "user": "Carlos Reyes",
                "rating": 5,
                "comment": "Great place to relax and have coffee.",
                "date": "2024-01-10"
            },
            {
                "user": "Maria Santos",
                "rating": 4,
                "comment": "Nice ambiance and good coffee.",
                "date": "2024-02-05"
            }
        ]
    },
];

function CafeSample() {
    const cafeSelected = cafes[0];

    return (
        <div className="cafe-page">
            <CafeDetails cafe={cafeSelected} />
        </div>
    );
}

export default CafeSample;