import "../styles/Profile.css";
import "../styles/CafeOwnerProfile.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function CafeOwnerProfile() {
  const navigate = useNavigate();
  const [ownerData, setOwnerData] = useState({
    name: "",
    role: "",
    email: "",
    bio: "",
    profilePic: "https://cdn-icons-png.flaticon.com/512/147/147285.png",
    coverImage:
      "https://t3.ftcdn.net/jpg/01/94/82/86/360_F_194828624_llDpKzFNYmi6cfHVF8GOOoAe5KTJlc9N.jpg",
  });
  const [cafeData, setCafeData] = useState({
    name: "",
    address: "",
    rating: 0,
    logo: "",
    openingHours: {},
    photos: [],
  });

  useEffect(() => {
    // Retrieve user data from local storage
    const userData = localStorage.getItem("userData");
    if (userData) {
      const user = JSON.parse(userData);
      setOwnerData({
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        email: user.email,
        bio: user.bio,
        profilePic:
          user.profilePicture ||
          "https://cdn-icons-png.flaticon.com/512/147/147285.png",
        coverImage:
          user.coverImage ||
          "https://t3.ftcdn.net/jpg/01/94/82/86/360_F_194828624_llDpKzFNYmi6cfHVF8GOOoAe5KTJlc9N.jpg",
      });

      // Fetch cafe data from the backend using the ownerId
      const fetchCafeData = async () => {
        try {
          const response = await axios.get("http://localhost:5500/api/cafe", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });

          const { cafe } = response.data;

          setCafeData({
            name: cafe.cafeName,
            address: cafe.address,
            rating: cafe.averageReview || 0,
            logo: cafe.logo || "/images/default-cafe-logo.png",
            openingHours: cafe.operatingHours,
            photos: cafe.photos,
          });
        } catch (error) {
          console.error("Error fetching cafe data:", error);
        }
      };

      fetchCafeData();
    }
  }, []);

  const handleLogoutClick = () => {
    // Clear user data from local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    // Redirect to login page
    navigate("/login");
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const handleEditCafe = () => {
    navigate("/edit-cafe");
  };

  return (
    <div className="profile">
      <div className="profile-cover">
        <img src={ownerData.coverImage} alt="profile cover" />

        <div className="profile-image">
          <img src={ownerData.profilePic} alt={`${ownerData.name}'s profile`} />
        </div>
      </div>
      <div className="profile-information">
        <div className="left">
          <div>
            <strong>{ownerData.name}</strong>
          </div>
          <div>{ownerData.role}</div>
          <div>{ownerData.bio}</div>
        </div>
        <div className="right">
          <p className="email">{ownerData.email}</p>
          <button className="edit-profile-btn" onClick={handleEditProfile}>
            Edit Profile
          </button>
          <button className="logout-btn" onClick={handleLogoutClick}>
            Logout
          </button>
        </div>
      </div>

      <div className="cafe-dashboard">
        <h2 className="dashboard-title">My Cafe</h2>
        <div className="cafe-details">
          <div className="cafe-content">
            <div className="cafe-info">
              <h1>{cafeData.name}</h1>
              <div className="rating">
                {"★".repeat(Math.floor(cafeData.rating))}
                {"☆".repeat(5 - Math.floor(cafeData.rating))}
                <span className="rating-text">({cafeData.rating})</span>
              </div>
              <p className="address">{cafeData.address}</p>

              <div className="hours-section">
                <h3>Opening Hours:</h3>
                <div className="hours-list">
                  {Object.entries(cafeData.openingHours).map(([day, hours]) => (
                    <div key={day} className="hours-item">
                      <span className="day">{day}</span>
                      <span className="time">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="cafe-logo-container">
              <img
                src={cafeData.logo}
                alt={`${cafeData.name} logo`}
                className="cafe-logo"
              />
              <button className="edit-cafe-btn" onClick={handleEditCafe}>
                Edit Cafe
              </button>
            </div>
          </div>

          <div className="cafe-gallery">
            {cafeData.photos.map((photo, index) => (
              <div key={index} className="gallery-item">
                <img src={photo} alt={`Cafe view ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
