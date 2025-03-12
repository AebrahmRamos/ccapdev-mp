import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/CafeDetails.module.css";
import { CafeDetails } from "../components/CafeDetails";
import { ImageGallery } from "../components/ImageGallery";
import CafeReviewSection from "../components/CafeReviewSection";

export default function CafePage() {
  const { slug } = useParams();
  const [cafe, setCafe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCafeAndReviews = async () => {
      try {
        // First fetch cafe data
        const cafeResponse = await fetch(`http://localhost:5500/api/cafes/${slug}`);
        if (!cafeResponse.ok) throw new Error("Failed to fetch cafe");
        const cafeData = await cafeResponse.json();
        setCafe(cafeData);

        // Then fetch reviews using the cafe's _id
        const reviewsResponse = await fetch(`http://localhost:5500/api/reviews/cafe/${cafeData._id}`);
        if (!reviewsResponse.ok) throw new Error("Failed to fetch reviews");
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCafeAndReviews();
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
      <CafeReviewSection reviews={reviews} /> {/* Pass reviews to ReviewsSection */}
    </div>
  );
}