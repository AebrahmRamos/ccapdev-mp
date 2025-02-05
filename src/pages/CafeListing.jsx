import { useState, useEffect } from "react";
import cafes from "../data/Cafes.json";
import CafeCard from "../components/CafeCard";
import "../styles/CafeListing.css";

function useDebounce(value, delay) {
    // debounce on search rah
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
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const filteredCafes = cafes
        .filter(cafe => cafe.cafeName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
        .sort((a, b) => sortOrder === "asc" ? a.averageReview - b.averageReview : b.averageReview - a.averageReview);

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
                    <a href={`/cafe/${cafe.id}`} key={cafe.id}>
                        <CafeCard 
                            image={`/images/cafe/${cafe.photos[0]}`}
                            title={cafe.cafeName} 
                        />
                    </a>
                ))}
            </div>
        </section>
    );
}