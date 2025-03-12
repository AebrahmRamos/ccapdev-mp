import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function CafeDetails() {
    const { cafeId } = useParams();
    const [cafe, setCafe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCafe = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('/src/data/cafes.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch cafe data');
                }
                const cafes = await response.json();
                const foundCafe = cafes.find(cafe => cafe.id === parseInt(cafeId, 10));
                if (!foundCafe) {
                    throw new Error('Cafe not found');
                }
                setCafe(foundCafe);
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCafe();
    }, [cafeId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="cafe-details">
            <h2>{cafe.cafeName}</h2>
            <p>Total Reviews: {cafe.totalReviews}</p>
            <p>Average Review: {cafe.averageReview}</p>
            <p>Address: {cafe.address}</p>
            {/*... render other cafe details... */}
        </div>
    );
}

export default CafeDetails;