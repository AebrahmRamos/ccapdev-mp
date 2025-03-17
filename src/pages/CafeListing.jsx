import { useState, useEffect } from "react";
import CafeCard from "../components/CafeCard";
import "../styles/CafeListing.css";

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
  const [cafes, setCafes] = useState([]); // Initialize cafes as an empty array
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchCafes = async () => {
      setLoading(true);
      setError(null); // Clear any previous errors
      try {
        const response = await fetch("http://localhost:5500/api/cafes");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCafes(data); // Assuming the API returns { cafes: [...] }
      } catch (e) {
        console.error("Failed to fetch cafes:", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchCafes();
  }, []); // Empty dependency array means this runs only once on component mount

  const filteredCafes = cafes
    .filter((cafe) =>
      cafe.cafeName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? (a.averageReview || 0) - (b.averageReview || 0) // Use 0 if averageReview is undefined
        : (b.averageReview || 0) - (a.averageReview || 0)
    );

  if (loading) {
    return <section className="cafe-listing">Loading cafes...</section>;
  }

  if (error) {
    return (
      <section className="cafe-listing">
        Error: {error.message}
      </section>
    );
  }

  return (
    <section className="cafe-listing">
      <h1 className="title">Cafe Listing</h1>
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search cafes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Sort by Rating: Low to High</option>
          <option value="desc">Sort by Rating: High to Low</option>
        </select>
      </div>
      <div className="cafe-grid">
        {filteredCafes.map((cafe) => (
          <a href={`/cafe/${cafe.slug}`} key={cafe._id}> {/* Use "/cafe" */}
            <CafeCard
              image={cafe.photos?.[0] || "/default-image.jpg"}
              title={cafe.cafeName}
            />
          </a>
        ))}
      </div>
    </section>
  );
}