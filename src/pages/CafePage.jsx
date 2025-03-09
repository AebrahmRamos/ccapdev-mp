// CafePage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/CafeDetails.module.css";
import { CafeDetails } from "../components/CafeDetails";
import { ImageGallery } from "../components/ImageGallery";
import { ReviewsSection } from "../components/ReviewsSection";

export default function CafePage() {
  const { slug } = useParams();
  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCafe = async () => {
      try {
        const response = await fetch(`http://localhost:5500/api/cafes/${slug}`);
        if (!response.ok) throw new Error("Failed to fetch cafe");
        const data = await response.json();
        setCafe(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCafe();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.cafeDetailsPage}>
      <CafeDetails
        cafeName={cafe.cafeName}
        totalReviews={cafe.totalReviews}
        averageReview={cafe.averageReview}
        address={cafe.address}
        operatingHours={cafe.operatingHours}
        mainImage={cafe.photos?.[0]}
      />
      <ImageGallery images={cafe.photos} />
      <ReviewsSection reviews={cafe.userReviews} />
    </div>
  );
}