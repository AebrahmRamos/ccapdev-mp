import { useState } from "react";
import PropTypes from "prop-types";
import styles from "../styles/CafeDetails.module.css";
import { EditReviewForm } from "./EditReviewForm";

export function ReviewCard({
  date,
  profileImage,
  textReview,
  rating,
  photos,
  videos,
  isProfilePage,
  onEdit,
  onDelete,
  reviewId,
}) {
  const [isEditing, setIsEditing] = useState(false);

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
  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewHeader}>
        <img src={profileImage} className={styles.reviewerImage} />
        <div
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <div className={styles.reviewerInfo}>
            <div className={styles.reviewerMeta}>
              <span></span>
              <span>{new Date(date).toLocaleDateString()}</span>
              {isProfilePage && onEdit && onDelete && reviewId && (
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
            {/* <div className={styles.ratingDisplay}>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/2e3cb4ba77b7a9e43e6a58691e9e2f820eebd3eb5244d80c29a4fe52a539c84e"
                alt="Rating stars"
                className={styles.ratingStars}
              />
              <span>({rating.ambiance})</span>
            </div> */}
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
    </div>
  );
}

ReviewCard.propTypes = {
  date: PropTypes.string.isRequired,
  profileImage: PropTypes.string.isRequired,
  textReview: PropTypes.string.isRequired,
  rating: PropTypes.object.isRequired,
  photos: PropTypes.array.isRequired,
  videos: PropTypes.array.isRequired,
  isProfilePage: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  reviewId: PropTypes.string,
};
