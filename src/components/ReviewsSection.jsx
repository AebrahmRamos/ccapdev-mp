import PropTypes from "prop-types";
import styles from "../styles/CafeDetails.module.css";
import { ReviewCard } from "./ReviewCard";

export function ReviewsSection({ reviews, isProfilePage, onEdit, onDelete }) {
  console.log("ReviewsSection props:", { reviews, isProfilePage, onEdit, onDelete });
  return (
    <div className={styles.reviewsSection}>
      <h2 className={styles.reviewsTitle}>Reviews</h2>
      <div className={styles.reviewsList}>
        {reviews.map((review, index) => {
          console.log("Review data:", review);
          return (
            <ReviewCard
              key={index}
              {...review}
              isProfilePage={isProfilePage}
              onEdit={onEdit}
              onDelete={onDelete}
              reviewId={review._id}
            />
          );
        })}
      </div>
    </div>
  );
}

ReviewsSection.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape(ReviewCard.propTypes)).isRequired,
  isProfilePage: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};