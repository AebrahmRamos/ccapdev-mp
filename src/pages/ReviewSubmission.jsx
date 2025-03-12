import React, { useState, useEffect } from 'react';
import '../styles/ReviewSubmission.css';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { set } from 'lodash';

const ReviewSubmission = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cafes, setCafes] = useState([]);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [ratings, setRatings] = useState({
    ambiance: 0,
    drinkQuality: 0,
    service: 0,
    wifiReliability: 0,
    cleanliness: 0,
    valueForMoney: 0,
  });
  const [hover, setHover] = useState({
    ambiance: 0,
    drinkQuality: 0,
    service: 0,
    wifiReliability: 0,
    cleanliness: 0,
    valueForMoney: 0,
  });
  const [photos, setPhotos] = useState([]);
  const [userId, setUserId] = useState(''); // This should come from your auth system

  // Fetch all cafes when the component mounts
  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const response = await fetch("http://localhost:5500/api/cafes");
        const data = await response.json();
        setCafes(data.cafes);
      } catch (err) {
        console.error('Error fetching cafes:', err);
      }
    };

    fetchCafes();
  }, []);

  useEffect(() => {
    // Get user ID from local storage or auth context
    const getCurrentUser = () => {
      // This should be replaced with your actual authentication logic
      const user = localStorage.getItem('userData');
      if (user) {
        setUserId(JSON.parse(user)._id);
      }
    };

    getCurrentUser();
  }, []);

  const handleCafeSelect = (e) => {
    const selectedCafeId = e.target.value;
    const cafe = cafes.find((cafe) => cafe._id === selectedCafeId);
    setSelectedCafe(cafe);
  };

  const handleRatingClick = (category, value) => {
    setRatings((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handlePhotoUpload = (e) => {
    // Handle photo upload logic
    // This is a placeholder - you'll need to implement file upload functionality
    const files = Array.from(e.target.files);
    setPhotos(files);
  };

  const calculateAverageRating = () => {
    const sum = Object.values(ratings).reduce((acc, curr) => acc + curr, 0);
    return sum / Object.keys(ratings).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError('You must be logged in to submit a review');
      return;
    }

    if (!selectedCafe) {
      setError('Please select a cafe to review');
      return;
    }

    // Validate ratings
    const hasAllRatings = Object.values(ratings).every((rating) => rating > 0);
    if (!hasAllRatings) {
      setError('Please provide ratings for all categories');
      return;
    }

    try {
      setIsLoading(true);

      // Create review object
      const reviewData = {
        cafeId: selectedCafe._id,
        userId,
        rating: ratings,
        textReview: reviewText,
        photos: [], // This would be replaced with actual photo URLs after upload
        videos: [], // Not implemented in this version
      };

      // Submit review
      const response = await axios.post('http://localhost:5500/api/reviews', reviewData);

      setIsLoading(false);

      // Redirect to cafe page or show success message
      alert('Review submitted successfully!');
      navigate(`/cafe/${selectedCafe.slug}`);
    } catch (err) {
      setIsLoading(false);
      setError('Failed to submit review. Please try again.');
      console.error('Error submitting review:', err);
    }
  };

  const ratingCategories = [
    { key: 'ambiance', label: 'Ambiance' },
    { key: 'drinkQuality', label: 'Drink Quality' },
    { key: 'service', label: 'Service' },
    { key: 'wifiReliability', label: 'WiFi Reliability' },
    { key: 'cleanliness', label: 'Cleanliness' },
    { key: 'valueForMoney', label: 'Value for Money' },
  ];

  return (
    <div className="review-submission-container">
      <h1>Submit Your Review</h1>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={(e) => {
        e.preventDefault();
        if (reviewText.length < 20) {
          setError('Review must be at least 20 characters long');
          return;
        }
        handleSubmit(e);
      }}>
        <div className="cafe-search-section">
          <label htmlFor="cafeSelect">Select a Cafe</label>
          <select id="cafeSelect" onChange={handleCafeSelect} required>
            <option value="">Select a cafe...</option>
            {cafes.map((cafe) => (
              <option key={cafe._id} value={cafe._id}>
                {cafe.cafeName}
              </option>
            ))}
          </select>
        </div>

        {selectedCafe && (
          <div className="selected-cafe-info">
            <h3>{selectedCafe.name}</h3>
          </div>
        )}

        {/* Rating sections */}
        {ratingCategories.map((category) => (
          <div className="rating-section" key={category.key}>
            <label>{category.label}</label>
            <div className="star-rating">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <FaStar
                    key={ratingValue}
                    className={
                      ratingValue <= (hover[category.key] || ratings[category.key])
                        ? 'star active'
                        : 'star'
                    }
                    onClick={() => handleRatingClick(category.key, ratingValue)}
                    onMouseEnter={() =>
                      setHover((prev) => ({ ...prev, [category.key]: ratingValue }))
                    }
                    onMouseLeave={() =>
                      setHover((prev) => ({ ...prev, [category.key]: 0 }))
                    }
                  />
                );
              })}
            </div>
          </div>
        ))}

        <div className="overall-rating">
          <label>Overall Rating</label>
          <div className="rating-display">
            {calculateAverageRating().toFixed(1)} / 5
          </div>
        </div>

        <div className="review-text-section">
          <label htmlFor="reviewText">Your Review</label>
          <textarea
            id="reviewText"
            placeholder="Write your detailed review here (minimum 20 characters)..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
            rows={5}
          />
          <div className="character-count">
            Characters: {reviewText.length} {reviewText.length < 20 && '(minimum 20 required)'}
          </div>
        </div>

        <div className="photo-upload-section">
          <label htmlFor="photoUpload">Add Photos (Optional)</label>
          <input
            type="file"
            id="photoUpload"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
          />
          <div className="photo-preview">
            {photos.length > 0 && `${photos.length} photo(s) selected`}
          </div>
        </div>

        <button
          type="submit"
          className="submit-review-btn"
          disabled={isLoading || !selectedCafe || reviewText.length < 20}
        >
          {isLoading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewSubmission;