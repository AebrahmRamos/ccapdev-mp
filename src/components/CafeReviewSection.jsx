import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "../styles/CafeDetails.module.css";
import api from "../utils/axiosConfig";
import { EditReviewForm } from "./EditReviewForm";

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
  isProfilePage,
  onEdit,
  onDelete,
}) {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [helpfulVotes, setHelpfulVotes] = useState(initialHelpfulVotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const IMAGES_PER_VIEW = 4;

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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (updatedReview) => {
    try {
      await onEdit(reviewId, updatedReview);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      return newIndex < 0
        ? Math.max(0, photos.length - IMAGES_PER_VIEW)
        : newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      return newIndex > photos.length - IMAGES_PER_VIEW ? 0 : newIndex;
    });
  };

  const visibleImages = photos.slice(
    currentIndex,
    currentIndex + IMAGES_PER_VIEW
  );
  const displayImages =
    photos.length < IMAGES_PER_VIEW ? photos : visibleImages;

  if (loading) return <div>Loading review...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewHeader}>
        <img
          src={profileImage || "/images/default-profile.png"}
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
              {isProfilePage && onEdit && onDelete && (
                <div className={styles.reviewActions}>
                  <button onClick={handleEdit} className={styles.editButton}>
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => onDelete(reviewId)}
                    className={styles.deleteButton}
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className={styles.amenityDetails}>
            <div>
              <strong>Ambiance:</strong> {rating.ambiance?.toFixed(0) || "N/A"}
            </div>
            <div>
              <strong>Drink Quality:</strong>{" "}
              {rating.drinkQuality?.toFixed(0) || "N/A"}
            </div>
            <div>
              <strong>Service:</strong> {rating.service?.toFixed(0) || "N/A"}
            </div>
            <div>
              <strong>Wi-Fi Reliability:</strong>{" "}
              {rating.wifiReliability?.toFixed(0) || "N/A"}
            </div>
            <div>
              <strong>Cleanliness:</strong>{" "}
              {rating.cleanliness?.toFixed(0) || "N/A"}
            </div>
            <div>
              <strong>Value for Money:</strong>{" "}
              {rating.valueForMoney?.toFixed(0) || "N/A"}
            </div>
          </div>
        </div>
      </div>

      {isEditing ? (
        <EditReviewForm
          review={{ textReview, rating }}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <p className={styles.reviewText}>{textReview}</p>
      )}

      {(photos.length > 0 || videos.length > 0) && (
        <div className={styles.galleryWrapper}>
          {photos.length > IMAGES_PER_VIEW && (
            <button
              onClick={handlePrevious}
              className={styles.galleryButton}
              aria-label="Previous images"
            >
              &lt;
            </button>
          )}
          <div className={styles.galleryContainer}>
            {displayImages.map((image, index) => (
              <div
                key={`${currentIndex}-${index}`}
                className={styles.galleryItem}
              >
                <img
                  onClick={() => setSelectedImage(getImageUrl(image))}
                  src={getImageUrl(image)}
                  alt={`Review photo ${index + 1}`}
                  className={styles.galleryImage}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/default-cafe-image.jpg";
                  }}
                />
              </div>
            ))}
          </div>
          {photos.length > IMAGES_PER_VIEW && (
            <button
              onClick={handleNext}
              className={styles.galleryButton}
              aria-label="Next images"
            >
              &gt;
            </button>
          )}
          {videos.map((video, index) => (
            <video key={index} controls className={styles.reviewVideo}>
              <source src={getImageUrl(video)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ))}
          {selectedImage && (
            <div
              className={styles.modalOverlay}
              onClick={() => setSelectedImage(null)}
            >
              <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedImage(null)}
                  className={styles.closeButton}
                >
                  ×
                </button>
                <img
                  src={selectedImage}
                  alt="Large view"
                  className={styles.modalImage}
                />
              </div>
            </div>
          )}
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

function ReviewsSection({
  reviews = [],
  currentUserId,
  isProfilePage,
  onEditReview,
  onDeleteReview,
}) {
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
            isProfilePage={isProfilePage}
            onEdit={onEditReview}
            onDelete={onDeleteReview}
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
  isProfilePage: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
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
  isProfilePage: PropTypes.bool,
  onEditReview: PropTypes.func,
  onDeleteReview: PropTypes.func,
};
