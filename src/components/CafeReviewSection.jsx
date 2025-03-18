import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "../styles/CafeDetails.module.css";
import api from "../utils/axiosConfig";

function ReviewCard({
  reviewId,
  date,
  userId,
  textReview,
  rating,
  photos,
  videos,
  helpfulVotes: initialHelpfulVotes,
  currentUserId,
}) {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState(null);
  const [helpfulVotes, setHelpfulVotes] = useState(initialHelpfulVotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  useEffect(() => {
    const fetchUserProfileImage = async () => {
      try {
        const response = await api.get(`/api/users/${userId}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch user data");
        }
        const userData = response.data;
        setProfileImage(userData.profilePicture);
        setName(`${userData.firstName} ${userData.lastName}`);
      } catch (error) {
        console.error("Error fetching user profile image:", error);
      }
    };

    fetchUserProfileImage();
  }, [userId]);

  useEffect(() => {
    const checkIfUserHasUpvoted = async () => {
      try {
        const response = await api.get(`/api/reviews/${reviewId}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch review data");
        }
        const reviewData = response.data;
        setHasUpvoted(reviewData.helpfulVoters.includes(currentUserId));
      } catch (error) {
        console.error("Error checking if user has upvoted:", error);
      }
    };

    checkIfUserHasUpvoted();
  }, [reviewId, currentUserId]);

  const handleHelpfulClick = async () => {
    try {
      const response = await api.put(`/api/reviews/${reviewId}/helpful`);
      setHelpfulVotes(response.data.helpfulVotes);
      setHasUpvoted(!hasUpvoted);
    } catch (error) {
      console.error("Error updating helpful votes:", error);
    }
  };

  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewHeader}>
        <img
          src={profileImage || "/default-profile-image.png"}
          alt={`${name}'s profile`}
          className={styles.reviewerImage}
        />
        <div
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <div className={styles.reviewerInfo}>
            <div className={styles.reviewerMeta}>
              <span>{name}</span>
              <span>{new Date(date).toLocaleDateString()}</span>
            </div>
          </div>
          <div className={styles.amenityDetails}>
            <div>
              <strong>Ambiance:</strong> {rating.ambiance}
            </div>
            <div>
              <strong>Drink Quality:</strong> {rating.drinkQuality}
            </div>
            <div>
              <strong>Service:</strong> {rating.service}
            </div>
            <div>
              <strong>Wi-Fi Reliability:</strong> {rating.wifiReliability}
            </div>
            <div>
              <strong>Cleanliness:</strong> {rating.cleanliness}
            </div>
            <div>
              <strong>Value for Money:</strong> {rating.valueForMoney}
            </div>
          </div>
        </div>
      </div>

      <p className={styles.reviewText}>{textReview}</p>
      {(photos.length > 0 || videos.length > 0) && (
        <div className={styles.reviewMedia}>
          {photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`Review photo ${index + 1}`}
              className={styles.reviewImage}
            />
          ))}
          {videos.map((video, index) => (
            <video key={index} controls className={styles.reviewVideo}>
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ))}
        </div>
      )}
      <div className={styles.reviewActions}>
        <span className={styles.helpfulText}>
          {helpfulVotes} found this helpful
        </span>
        <button
          onClick={handleHelpfulClick}
          className={styles.helpfulButton}
          tabIndex={0}
        >
          {hasUpvoted
            ? "Remove helpful vote 👎🏻"
            : "Was this review helpful? 👍🏻"}
        </button>
      </div>
    </div>
  );
}

function ReviewsSection({ reviews, currentUserId }) {
  return (
    <div className={styles.reviewsSection}>
      <h2 className={styles.reviewsTitle}>Reviews</h2>
      <div className={styles.reviewsList}>
        {Array.isArray(reviews) &&
          reviews.map((review, index) => (
            <ReviewCard
              key={index}
              reviewId={review._id}
              date={review.date}
              userId={review.userId}
              textReview={review.textReview}
              rating={review.rating}
              photos={review.photos}
              videos={review.videos}
              helpfulVotes={review.helpfulVotes}
              currentUserId={currentUserId}
            />
          ))}
      </div>
    </div>
  );
}

export default ReviewsSection;

ReviewCard.propTypes = {
  reviewId: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  textReview: PropTypes.string.isRequired,
  rating: PropTypes.shape({
    ambiance: PropTypes.number.isRequired,
    drinkQuality: PropTypes.number.isRequired,
    service: PropTypes.number.isRequired,
    wifiReliability: PropTypes.number.isRequired,
    cleanliness: PropTypes.number.isRequired,
    valueForMoney: PropTypes.number.isRequired,
  }).isRequired,
  photos: PropTypes.arrayOf(PropTypes.string),
  videos: PropTypes.arrayOf(PropTypes.string),
  helpfulVotes: PropTypes.number.isRequired,
  currentUserId: PropTypes.string.isRequired,
};

ReviewsSection.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
      textReview: PropTypes.string.isRequired,
      rating: PropTypes.shape({
        ambiance: PropTypes.number.isRequired,
        drinkQuality: PropTypes.number.isRequired,
        service: PropTypes.number.isRequired,
        wifiReliability: PropTypes.number.isRequired,
        cleanliness: PropTypes.number.isRequired,
        valueForMoney: PropTypes.number.isRequired,
      }).isRequired,
      photos: PropTypes.arrayOf(PropTypes.string),
      videos: PropTypes.arrayOf(PropTypes.string),
      helpfulVotes: PropTypes.number.isRequired,
    })
  ).isRequired,
  currentUserId: PropTypes.string.isRequired,
};
