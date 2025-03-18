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
  date,
  userId,
  textReview,
  rating,
  photos = [],
  videos = [],
}) {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div>Loading review...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewHeader}>
        <img
          src={profileImage}
          alt={`${name}'s profile`}
          className={styles.reviewerImage}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/default-profile.png";
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <div className={styles.reviewerInfo}>
            <div className={styles.reviewerMeta}>
              <span>{name}</span>
              <span>{new Date(date).toLocaleDateString()}</span>
            </div>
          </div>
          <div className={styles.amenityDetails}>
            {Object.entries(rating).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value?.toFixed(1) || "N/A"}
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
      <button className={styles.helpfulButton} tabIndex={0}>
        Was this review helpful? 👍🏻
      </button>
    </div>
  );
}

function ReviewsSection({ reviews = [] }) {
  return (
    <div className={styles.reviewsSection}>
      <h2 className={styles.reviewsTitle}>Reviews</h2>
      <div className={styles.reviewsList}>
        {reviews.map((review, index) => (
          <ReviewCard key={index} {...review} userId={review.userId} />
        ))}
      </div>
    </div>
  );
}

export default ReviewsSection;

ReviewCard.propTypes = {
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
};

ReviewsSection.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
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
    })
  ),
};