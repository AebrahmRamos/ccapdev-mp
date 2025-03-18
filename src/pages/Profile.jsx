import { useState, useEffect } from "react";
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
        const userId = userData._id;

        // Fetch user profile first
        const profileResponse = await api.get(`/api/users/${userId}`);
        setUserProfile(profileResponse.data);

        // Then fetch user reviews using the fetched profile
        const reviewsResponse = await api.get(`/api/reviews/user/${userId}`);
        const reviewsWithUserInfo = reviewsResponse.data.map((review) => ({
          ...review,
          user: profileResponse.data.username,
          profileImage:
            profileResponse.data.profilePicture ||
            "https://via.placeholder.com/150",
          date: review.date || review.createdAt || new Date().toISOString(),
          photos: review.photos || [],
          videos: review.videos || [],
          rating: review.rating || {
            ambiance: review.ambiance || 0,
            drinkQuality: review.drinkQuality || 0,
            service: review.service || 0,
            wifiReliability: review.wifiReliability || 0,
            cleanliness: review.cleanliness || 0,
            valueForMoney: review.valueForMoney || 0,
          },
          textReview: review.textReview || review.content || "",
        }));
        setUserReviews(reviewsWithUserInfo);
        console.log("User Reviews:", reviewsWithUserInfo);

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

  const handleLogoutClick = () => {
    // Clear user data from local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    // Redirect to login page
    navigate("/login");
  };

  const updateCafeRatings = async (cafeId, isDelete = false) => {
    const reviews = await api.get(`/api/reviews/cafe/${cafeId}`);
    let totalReviews = reviews.data.length;

    if (isDelete) {
      totalReviews -= 1;
    }

    const totalAverageRating =
      reviews.data.reduce((acc, review) => {
        const reviewAverageRating =
          (review.rating.ambiance +
            review.rating.drinkQuality +
            review.rating.service +
            review.rating.wifiReliability +
            review.rating.cleanliness +
            review.rating.valueForMoney) /
          6;
        return acc + reviewAverageRating;
      }, 0) / totalReviews;

    await api.put(`/api/cafes/${cafeId}`, {
      totalReviews,
      totalAverageRating: parseFloat(totalAverageRating.toFixed(1)),
    });
  };

  const handleEditReview = async (reviewId, updatedReview) => {
    try {
      console.log("Sending update for review:", reviewId, updatedReview);
      const response = await api.put(`/api/reviews/${reviewId}`, updatedReview);
      console.log("Update response:", response.data);

      // Update the reviews list with the edited review, preserving other fields
      setUserReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId
            ? {
                ...review,
                ...updatedReview,
                rating: {
                  ...review.rating,
                  ...updatedReview.rating,
                },
              }
            : review
        )
      );

      // Update the cafe's ratings
      await updateCafeRatings(updatedReview.cafeId);
    } catch (error) {
      console.error("Error editing review:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        const reviewToDelete = userReviews.find(
          (review) => review._id === reviewId
        );
        await api.delete(`/api/reviews/${reviewId}`);
        // Update the reviews list by filtering out the deleted review
        setUserReviews((prevReviews) =>
          prevReviews.filter((review) => review._id !== reviewId)
        );

        // Update the cafe's ratings
        await updateCafeRatings(reviewToDelete.cafeId, true);
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
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
            <strong>
              {userProfile.firstName} {userProfile.lastName}
            </strong>
          </div>
          <div>{userProfile.role || "Student"}</div>
          <div>{userProfile.bio}</div>
        </div>
        <div className="right">
          <p className="email">{userProfile.email}</p>
          <button className="edit-profile-btn" onClick={handleEditClick}>
            Edit Profile
          </button>
          <button className="logout-btn" onClick={handleLogoutClick}>
            Logout
          </button>
        </div>
      </div>
      {userReviews.length > 0 && (
        <div className="reviews" style={{ width: "100%" }}>
          <ReviewsSection
            reviews={userReviews}
            isProfilePage={true}
            onEdit={handleEditReview}
            onDelete={handleDeleteReview}
          />
        </div>
      )}
    </div>
  );
}
