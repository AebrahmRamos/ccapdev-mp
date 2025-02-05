import "../styles/Profile.css";
import CafeCard from "../components/CafeCard";
import cafes from "../data/Cafes.json";
import { ReviewsSection } from "../components/ReviewsSection";

export default function Profile() {
    // Hardcoded user details
    const name = "John Doe";
    const email = "john.doe@example.com";
    const profilePic = "https://cdn-icons-png.flaticon.com/512/147/147285.png";
    const bio = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    const favoriteCafes = [1, 2, 3];
    const reviews = ["Review 1", "Review 2"];
    const userReviews = [
        {
            "user": "John Doe",
            "rating": 5,
            "comment": "Great coffee and atmosphere!",
            "date": "Starbucks"
        },
        {
            "user": "John Doe",
            "rating": 4,
            "comment": "A bit pricey, but the quality is good.",
            "date": "The Coffee Bean & Tea Leaf"
        }
    ];

    return (
        <div className="profile">
            <div className="profile-cover">
                <img src="https://t3.ftcdn.net/jpg/01/94/82/86/360_F_194828624_llDpKzFNYmi6cfHVF8GOOoAe5KTJlc9N.jpg" alt="coffee hero banner" />
            </div>
            <div className="profile-image">
                <img src={profilePic} alt={`${name}'s profile`} />
            </div>
            <div className="profile-information">
                <div className="left">
                    <div><strong>{name}</strong></div>
                    <div>Student</div>
                    <div>{bio}</div>
                </div>
                <div className="right">
                    <p className="email">
                        {email}
                    </p>
                </div>
            </div>
            <div className="favorite-cafes">
                <h1>Favorite Cafes</h1>
                <div className="cafe-grid">
                    {favoriteCafes.map((cafeId) => {
                        return (
                            <a href={`/cafe/${cafeId}`} key={cafeId}>
                                <CafeCard key={cafeId} className="cafe-card" image={`/images/cafe/cafe${cafeId}.jpg`} title={`Cafe ${cafeId}`}/>
                            </a>
                        );
                    })}
                </div>
            </div>
            <div className="reviews" style={{ width: "100%" }}>
                <ReviewsSection reviews={userReviews} />
            </div>
        </div>
    );
}