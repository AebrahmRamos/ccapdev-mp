import "../styles/Profile.css";
import "../styles/CafeOwnerProfile.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../utils/axiosConfig";

export default function CafeOwnerProfile() {
  const navigate = useNavigate();
  const [ownerData, setOwnerData] = useState(null);
  const [cafeData, setCafeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (!userData) throw new Error("No user data found");

        // Fetch owner profile
        const ownerResponse = await api.get(`/api/users/${userData._id}`);
        const owner = ownerResponse.data;

        // Fetch cafe data
        const cafeResponse = await api.get(`/api/cafes/owner/${userData._id}`);
        const cafe = cafeResponse.data;

        setOwnerData({
          name: `${owner.firstName} ${owner.lastName}`,
          role: owner.role,
          email: owner.email,
          bio: owner.bio,
          profilePic: owner.profilePicture,
          coverImage:
            owner.coverImage ||
            "https://t3.ftcdn.net/jpg/01/94/82/86/360_F_194828624_llDpKzFNYmi6cfHVF8GOOoAe5KTJlc9N.jpg",
        });

        setCafeData({
          ...cafe,
          logo: cafe.photos[0] || "/images/default-cafe-logo.png",
          photos: cafe.photos || [],
          operatingHours: cafe.operatingHours || {},
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  const handleEditProfile = () => navigate("/edit-profile");
  const handleEditCafe = () => navigate("/edit-cafe");

  const getImageUrl = (image) => {
    if (!image) return "https://cdn-icons-png.flaticon.com/512/147/147285.png";
    if (image.startsWith("http") || image.startsWith("data:image")) return image;
    return `http://localhost:5500/api/images/${image}`;
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!ownerData) return <p>No profile data available</p>;

  return (
    <div className="profile">
      <div className="profile-cover">
        <img src={ownerData.coverImage} alt="profile cover" />
        <div className="profile-image">
          <img
            src={getImageUrl(ownerData.profilePic)}
            alt={`${ownerData.name}'s profile`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://cdn-icons-png.flaticon.com/512/147/147285.png";
            }}
          />
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

      {cafeData && (
        <div className="cafe-dashboard">
          <h2 className="dashboard-title">My Cafe</h2>
          <div className="cafe-details">
            <div className="cafe-content">
              <div className="cafe-info">
                <h1>{cafeData.cafeName}</h1>
                <div className="rating">
                  {Array(5)
                    .fill()
                    .map((_, i) => (
                      <span key={i}>
                        {i < Math.floor(cafeData.averageReview) ? "★" : "☆"}
                      </span>
                    ))}
                  <span>({cafeData.averageReview?.toFixed(1) || 0})</span>
                </div>
                <p className="address">{cafeData.address}</p>

                <div className="hours-section">
                  <h3>Opening Hours:</h3>
                  <div className="hours-list">
                    {Object.entries(cafeData.operatingHours).map(([day, hours]) => (
                      <div key={day} className="hours-item">
                        <span className="day">{day}</span>
                        <span className="time">{hours || "Closed"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="cafe-logo-container">
                <img
                  src={getImageUrl(cafeData.logo)}
                  alt={`${cafeData.cafeName} logo`}
                  className="cafe-logo"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/default-cafe-logo.png";
                  }}
                />
                <button className="edit-cafe-btn" onClick={handleEditCafe}>
                  Edit Cafe
                </button>
              </div>
            </div>

            <div className="cafe-gallery">
              {cafeData.photos.map((photo, index) => (
                <div key={index} className="gallery-item">
                  <img
                    src={getImageUrl(photo)}
                    alt={`Cafe view ${index + 1}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/default-cafe-image.jpg";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}