import React, { useState } from 'react';
import '../styles/ReviewSubmission.css';
import { FaStar } from 'react-icons/fa';
import RadioReviews from '../components/RadioReviews';

const ReviewSubmission = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [cafeDetails, setCafeDetails] = useState({
    ambience: '',
    pricing: '',
  });
  const [reviewText, setReviewText] = useState('');

  const handleRatingClick = (currentRating) => {
    setRating(currentRating);
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setCafeDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement actual submission logic
    console.log({
      rating,
      cafeDetails,
      reviewText
    });
    alert('Review Submitted!');
  };

  return (
    <div className="review-submission-container">
      <h1>Submit Your Cafe Review</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="cafe-name-section">
          <label htmlFor="cafeName">Cafe Name</label>
          <input 
            type="text" 
            id="cafeName" 
            placeholder="Enter Cafe Name" 
            required 
          />
        </div>

        <div className="rating-section">
          <label>Overall Rating</label>
          <div className="star-rating">
            {[...Array(5)].map((star, index) => {
              index += 1;
              return (
                <FaStar
                  key={index}
                  className={index <= (hover || rating) ? "star active" : "star"}
                  onClick={() => handleRatingClick(index)}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(rating)}
                />
              );
            })}
          </div>
        </div>

        <RadioReviews 
          cafeDetails={cafeDetails} 
          onChange={handleDetailsChange} 
        />

        <div className="review-text-section">
          <label htmlFor="reviewText">Your Review</label>
          <textarea 
            id="reviewText"
            placeholder="Write your review here..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-review-btn">
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewSubmission;