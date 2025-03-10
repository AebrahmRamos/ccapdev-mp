import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import "../styles/Profile.css";
import { ReviewsSection } from "../components/ReviewsSection";

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataString = localStorage.getItem("userData");
        if (!userDataString) {
          throw new Error("No user data found");
        }

        const userData = JSON.parse(userDataString);
        const email = userData.email;
        const userId = userData._id;

        // Fetch user profile first
        const profileResponse = await api.get(`/api/users/${email}`);
        setUserProfile(profileResponse.data);
        // console.log('User Data:', profileResponse.data); // Added console.log

        // Then fetch user reviews using the fetched profile
        const reviewsResponse = await api.get(`/api/reviews/user/${userId}`);
        const reviewsWithUserInfo = reviewsResponse.data.map((review) => ({
          ...review,
          user: profileResponse.data.username,
          profileImage: profileResponse.data.profilePicture,
        }));
        setUserReviews(reviewsWithUserInfo);
        // console.log('User Reviews:', reviewsWithUserInfo); // Added console.log

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = () => {
    navigate("/edit-profile");
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!userProfile) {
    return <p>No profile data available</p>;
  }

  return (
    <div className="profile">
      <div className="profile-cover">
        <img
          src="https://t3.ftcdn.net/jpg/01/94/82/86/360_F_194828624_llDpKzFNYmi6cfHVF8GOOoAe5KTJlc9N.jpg"
          alt="coffee hero banner"
        />
      </div>
      <div className="profile-image">
        <img
          src={userProfile.profilePicture}
          alt={`${userProfile.username}'s profile`}
        />
      </div>
      <div className="profile-information">
        <div className="left">
          <div>
            <strong>{userProfile.username}</strong>
          </div>
          <div>{userProfile.role || "Student"}</div>
          <div>bio</div>
        </div>
        <div className="right">
          <p className="email">{userProfile.email}</p>
          <button className="edit-profile-btn" onClick={handleEditClick}>
            Edit Profile
          </button>
        </div>
      </div>
      {/* <div className="favorite-cafes">
        <h1>Favorite Cafes</h1>
        <div className="cafe-grid">
          {favoriteCafes.map((cafeId) => {
            return (
              <a href={`/cafe/${cafeId}`} key={cafeId}>
                <CafeCard
                  key={cafeId}
                  className="cafe-card"
                  image={`/images/cafe/cafe${cafeId}.jpg`}
                  title={`Cafe ${cafeId}`}
                />
              </a>
            );
          })}
        </div>
      </div> */}
      {userReviews.length > 0 && (
        <div className="reviews" style={{ width: "100%" }}>
          <ReviewsSection reviews={userReviews} />
        </div>
      )}
    </div>
  );
}