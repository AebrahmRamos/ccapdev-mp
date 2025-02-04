import React from 'react';
import styles from '../styles/CafeDetails.module.css';
import { ReviewCard } from './ReviewCard';

export function ReviewsSection({ reviews }) {
  return (
    <div className={styles.reviewsSection}>
      <h2 className={styles.reviewsTitle}>User Reviews</h2>
      <div className={styles.reviewsList}>
        {reviews.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </div>
    </div>
  );
}