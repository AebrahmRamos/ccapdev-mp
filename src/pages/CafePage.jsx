import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/CafeDetails.module.css";
import { CafeDetails } from "../components/CafeDetails";
import { ImageGallery } from "../components/ImageGallery";
import CafeReviewSection from "../components/CafeReviewSection";
import axios from "axios";
import { motion } from "framer-motion";

export default function CafePage() {
  const { slug } = useParams();
  const [cafe, setCafe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCafeAndReviews = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch cafe data
        const cafeResponse = await axios.get(
          `https://coffee-crawl-ccapdev.vercel.app/api/cafes/${slug}`
        );
        const cafeData = cafeResponse.data;
        setCafe(cafeData);

        // Fetch reviews using the cafe's _id
        const reviewsResponse = await axios.get(
          `https://coffee-crawl-ccapdev.vercel.app/api/reviews/cafe/${cafeData._id}`
        );
        const reviewsData = reviewsResponse.data;
        setReviews(reviewsData);
      } catch (err) {
        console.error("Error fetching cafe or reviews:", err);
        setError(err.response?.data?.message || "Failed to load cafe details");
      } finally {
        setLoading(false);
      }
    };

    fetchCafeAndReviews();
  }, [slug]);

  const getImageUrl = (image) => {
    if (!image) return "/images/default-cafe-image.jpg";
    if (image.startsWith("http") || image.startsWith("data:image"))
      return image;
    return `https://coffee-crawl-ccapdev.vercel.app/api/images/${image}`;
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!cafe) return <div className={styles.error}>Cafe not found</div>;

  return (
    <motion.div
      className={styles.cafeDetailsPage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <CafeDetails
        cafeName={cafe.cafeName}
        totalReviews={cafe.totalReviews || 0}
        averageReview={cafe.averageReview?.toFixed(1) || "N/A"}
        address={cafe.address}
        operatingHours={cafe.operatingHours || {}}
        mainImage={getImageUrl(cafe.photos?.[0])} // Use the first photo or a default image
      />
      <ImageGallery images={cafe.photos?.map(getImageUrl) || []} />
      <CafeReviewSection reviews={reviews} />
    </motion.div>
  );
}
