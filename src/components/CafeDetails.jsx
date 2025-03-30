import PropTypes from "prop-types";
import styles from "../styles/CafeDetails.module.css";

export function CafeDetails({
  cafeName,
  totalReviews,
  averageReview,
  address,
  operatingHours,
  mainImage,
}) {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <div className={styles.headerLayout}>
          <div className={styles.infoColumn}>
            <div className={styles.titleSection}>
              <h1 className={styles.cafeName}>{cafeName}</h1>
              <div className={styles.ratingContainer}>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/2e3cb4ba77b7a9e43e6a58691e9e2f820eebd3eb5244d80c29a4fe52a539c84e"
                  alt="Rating stars"
                  className={styles.ratingStars}
                />
                <span className={styles.ratingScore}>({averageReview})</span>
                <span className={styles.reviewCount}>
                  <strong>Total Reviews:</strong> {totalReviews}
                </span>
              </div>
            </div>
            <div className={styles.address}>
              <span>
                <strong>Address:</strong> {address}
              </span>
            </div>
            <div className={styles.hoursSection}>
              <div className={styles.hoursTitle}>
                <strong>Opening Hours:</strong>
              </div>
              <div className={styles.hoursList}>
                <div className={styles.hoursDay}>
                  {Object.keys(operatingHours).map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
                <div className={styles.hoursTime}>
                  {Object.values(operatingHours).map((hours, index) => (
                    <span key={index}>{hours}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.imageColumn}>
            <img
              src={`${mainImage}`}
              alt={`${cafeName} exterior`}
              className={styles.cafeImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

CafeDetails.propTypes = {
  cafeName: PropTypes.string.isRequired,
  totalReviews: PropTypes.number.isRequired,
  averageReview: PropTypes.number.isRequired,
  address: PropTypes.string.isRequired,
  operatingHours: PropTypes.object.isRequired,
  mainImage: PropTypes.string.isRequired,
};
