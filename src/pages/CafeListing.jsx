import { useState, useEffect } from "react";
import CafeCard from "../components/CafeCard";
import "../styles/CafeListing.css";
import axios from "axios";
import { motion } from "framer-motion";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function CafeListing() {
  const [cafes, setCafes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchCafes = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("http://localhost:5500/api/cafes");
        setCafes(response.data); // Assuming the API returns an array of cafes
      } catch (error) {
        console.error("Failed to fetch cafes:", error);
        setError(error.response?.data?.message || "Failed to fetch cafes");
      } finally {
        setLoading(false);
      }
    };

    fetchCafes();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "/images/default-cafe-image.jpg";
    if (image.startsWith("http") || image.startsWith("data:image"))
      return image;
    return `http://localhost:5500/api/images/${image}`;
  };

  const filteredCafes = cafes
    .filter((cafe) =>
      cafe.cafeName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? (a.averageReview || 0) - (b.averageReview || 0)
        : (b.averageReview || 0) - (a.averageReview || 0)
    );

  if (loading) {
    return <section className="cafe-listing">Loading cafes...</section>;
  }

  if (error) {
    return <section className="cafe-listing">Error: {error}</section>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className="cafe-listing">
        <h1 className="title">Cafe Listing</h1>
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search cafes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Sort by Rating: Low to High</option>
            <option value="desc">Sort by Rating: High to Low</option>
          </select>
        </div>
        <div className="cafe-grid">
          {filteredCafes.map((cafe) => (
            <a href={`/cafe/${cafe.slug}`} key={cafe._id}>
              <CafeCard
                image={getImageUrl(cafe.photos?.[0])} // Use the first photo or a default image
                title={cafe.cafeName}
                rating={cafe.averageReview?.toFixed(1) || "N/A"}
                address={cafe.address}
              />
            </a>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
