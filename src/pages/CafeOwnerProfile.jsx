import "../styles/Profile.css";
import "../styles/CafeOwnerProfile.css";
import { useNavigate } from "react-router-dom";

export default function CafeOwnerProfile() {
  const navigate = useNavigate();

  // Hardcoded owner details
  const ownerData = {
    name: "John Smith",
    role: "Cafe Owner",
    email: "john.smith@elsewhere.cafe",
    bio: "Proud owner of Elsewhere Cafe, serving the best coffee in Manila since 2020.",
    profilePic: "https://cdn-icons-png.flaticon.com/512/147/147285.png",
    coverImage:
      "https://t3.ftcdn.net/jpg/01/94/82/86/360_F_194828624_llDpKzFNYmi6cfHVF8GOOoAe5KTJlc9N.jpg",
  };

  // Hardcoded cafe details
  const cafeData = {
    name: "Elsewhere Cafe",
    address: "3/F, 2510 Taft Ave, Malate, Manila, 1004 Metro Manila",
    rating: 4.5,
    logo: "/images/aeb.jpg",
    openingHours: {
      Monday: "12-9PM",
      Tuesday: "12-9PM",
      Wednesday: "12-9PM",
      Thursday: "12-9PM",
      Friday: "12-9PM",
      Saturday: "12-9PM",
      Sunday: "Closed",
    },
    photos: [
      "/images/cafe/cafe1.jpg",
      "/images/cafe/cafe2.jpg",
      "/images/cafe/cafe3.jpg",
      "/images/cafe/cafe4.jpg",
    ],
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
        </div>
      </div>

      <div className="cafe-dashboard">
        <h2 className="dashboard-title">My Cafe</h2>
        <div className="cafe-details">
          <div className="cafe-content">
            <div className="cafe-info">
              <h1>{cafeData.name}</h1>
              <div className="rating">
                {"★".repeat(4)}
                {"☆"}
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
