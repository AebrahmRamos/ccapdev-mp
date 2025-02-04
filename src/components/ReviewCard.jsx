import React from 'react';
import styles from '../styles/CafeDetails.module.css';

export function ReviewCard({
  name,
  date,
  rating,
  profileImage,
  ambiance,
  pricing,
  wifi,
  outlets,
  seating,
  review,
  images
}) {
  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewHeader}>
        <img
          src={profileImage}
          alt={`${name}'s profile`}
          className={styles.reviewerImage}
        />
        <div className={styles.reviewerInfo}>
          <div className={styles.reviewerMeta}>
            <span>{name}</span>
            <span>{date}</span>
          </div>
          <div className={styles.ratingDisplay}>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/2e3cb4ba77b7a9e43e6a58691e9e2f820eebd3eb5244d80c29a4fe52a539c84e?placeholderIfAbsent=true&apiKey=99eff07de93a442a8e01c5af4301b6ea"
              alt="Rating stars"
              className={styles.ratingStars}
            />
            <span>({rating})</span>
          </div>
          <div className={styles.amenityRating}>
            Ambiance Rating: {ambiance}
          </div>
          <div className={styles.amenityRating}>
            Pricing Range: {pricing}
          </div>
        </div>
      </div>
      <div className={styles.amenityDetails}>
        <div>Wi-Fi Strength: {wifi}</div>
        <div>Charging Outlets: {outlets}</div>
        <div>Seating: {seating}</div>
      </div>
      <p className={styles.reviewText}>{review}</p>
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