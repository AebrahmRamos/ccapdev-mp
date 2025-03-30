import { useState } from "react";
import PropTypes from "prop-types";
import styles from "../styles/CafeDetails.module.css";
import { EditReviewForm } from "./EditReviewForm";

const getImageUrl = (image) => {
  if (!image) return "/images/default-profile.png";
  if (image.startsWith("http") || image.startsWith("data:image")) return image;
  return `http://localhost:5500/api/images/${image}`;
};

export function ReviewCard({
  profileImage,
  textReview,
  rating,
  photos = [],
  videos = [],
  isProfilePage,
  onEdit,
  onDelete,
  reviewId,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const IMAGES_PER_VIEW = 4;

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

  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewHeader}>
        <img
          src={getImageUrl(profileImage)}
          className={styles.reviewerImage}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/default-profile.png";
          }}
        />

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
        <div className={styles.reviewerInfo}></div>

        <div className={styles.reviewerMeta}>
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
