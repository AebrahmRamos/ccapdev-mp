import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "../styles/CafeDetails.module.css";
import api from "../utils/axiosConfig";

const getImageUrl = (image) => {
  if (!image) return "/images/default-profile.png";
  if (image.startsWith("http") || image.startsWith("data:image")) return image;
  return `http://localhost:5500/api/images/${image}`;
};

function ReviewCard({
  reviewId,
  date,
  userId,
  textReview,
  rating,
  photos = [],
  videos = [],
  helpfulVotes: initialHelpfulVotes,
  currentUserId,
}) {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        setProfileImage(getImageUrl(userData.profilePicture));
        setName(`${userData.firstName} ${userData.lastName}`);
      } catch (error) {
        console.error("Error fetching user profile image:", error);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
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

  if (loading) return <div>Loading review...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewHeader}>
        <img
          src={profileImage || "/default-profile-image.png"}
          alt={`${name}'s profile`}
          className={styles.reviewerImage}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/default-profile.png";
          }}
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
            {Object.entries(rating).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value?.toFixed(0) || "N/A"}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className={styles.reviewText}>{textReview}</p>
      {(photos.length > 0 || videos.length > 0) && (
        <div className={styles.reviewMedia}>
          {photos.map((photo, index) => (
            <img
              key={index}
              src={getImageUrl(photo)}
              alt={`Review photo ${index + 1}`}
              className={styles.reviewImage}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/default-cafe-image.jpg";
              }}
            />
          ))}
          {videos.map((video, index) => (
            <video key={index} controls className={styles.reviewVideo}>
              <source src={getImageUrl(video)} type="video/mp4" />
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

function ReviewsSection({ reviews = [], currentUserId }) {
  return (
    <div className={styles.reviewsSection}>
      <h2 className={styles.reviewsTitle}>Reviews</h2>
      <div className={styles.reviewsList}>
        {reviews.map((review) => (
          <ReviewCard
            key={review._id}
            reviewId={review._id}
            date={review.date}
            userId={review.userId}
            textReview={review.textReview}
            rating={review.rating}
            photos={review.photos || []}
            videos={review.videos || []}
            helpfulVotes={review.helpfulVotes || 0}
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
    ambiance: PropTypes.number,
    drinkQuality: PropTypes.number,
    service: PropTypes.number,
    wifiReliability: PropTypes.number,
    cleanliness: PropTypes.number,
    valueForMoney: PropTypes.number,
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
  ),
  currentUserId: PropTypes.string.isRequired,
};
