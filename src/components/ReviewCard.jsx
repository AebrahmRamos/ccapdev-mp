import React from "react";
import styles from "../styles/CafeDetails.module.css";

export function ReviewCard({
  user,
  date,
  rating,
  profileImage,
  comment,
  ambiance,
  pricing,
  wifi,
  outlets,
  seating,
  images,
}) {
  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewHeader}>
        {/* Replace with actual image fetching logic */}
        <img
          src={profileImage}
          alt={`${user}'s profile`}
          className={styles.reviewerImage}
        />
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <div className={styles.reviewerInfo}>
            <div className={styles.reviewerMeta}>
              <span>{user}</span>
              <span>{date}</span>
            </div>
            <div className={styles.ratingDisplay}>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/2e3cb4ba77b7a9e43e6a58691e9e2f820eebd3eb5244d80c29a4fe52a539c84e"
                alt="Rating stars"
                className={styles.ratingStars}
              />
              <span>({rating})</span>
            </div>
          </div>
          <div className={styles.amenityDetails}>
            <div>
              <strong>Ambiance:</strong> {ambiance}
            </div>
            <div>
              <strong>Pricing:</strong> {pricing}
            </div>
            <div>
              <strong>Wi-Fi Strength:</strong> {wifi}
            </div>
            <div>
              <strong>Charging Outlets:</strong> {outlets}
            </div>
            <div>
              <strong>Seating:</strong> {seating}
            </div>
          </div>
        </div>
      </div>

      <p className={styles.reviewText}>{comment}</p>
      {images && (
        <div className={styles.reviewImages}>
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Review image ${index + 1}`}
              className={styles.reviewImage}
            />
          ))}
        </div>
      )}
      {images && (
        <button className={styles.helpfulButton} tabIndex={0}>
          Was this review helpful? 👍🏻
        </button>
      )}
    </div>
  );
}