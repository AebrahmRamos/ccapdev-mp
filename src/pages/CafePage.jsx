import React from "react";
import styles from "../styles/CafeDetails.module.css";
import { CafeDetails } from "../components/CafeDetails";
import { ImageGallery } from "../components/ImageGallery";
import { ReviewsSection } from "../components/ReviewsSection";

export default function CafePage({ cafe }) {
  // Destructure cafe details
  const {
    cafeName,
    totalReviews,
    averageReview,
    address,
    operatingHours,
    photos,
    userReviews,
  } = cafe;

  return (
    <div className={styles.cafeDetailsPage}>
      <CafeDetails
        cafeName={cafeName}
        totalReviews={totalReviews}
        averageReview={averageReview}
        address={address}
        operatingHours={operatingHours}
        mainImage={photos[0]}
      />
      <ImageGallery images={photos} />
      <ReviewsSection reviews={userReviews} />
    </div>
  );
}