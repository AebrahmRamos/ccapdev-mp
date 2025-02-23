import React, { useState } from "react";
import "../styles/EditProfile.css";

export default function EditProfile() {
  const [profileDetails, setProfileDetails] = useState({
    profilePic: "https://cdn-icons-png.flaticon.com/512/147/147285.png",
    name: "",
    email: "",
    bio: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileDetails((prev) => ({
          ...prev,
          profilePic: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement actual update logic
    console.log("Updated Profile Details:", profileDetails);
    alert("Profile Updated!");
  };

  return (
    <div className="edit-profile-page-container">
      <h1>Edit Your Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="profile-pic-section">
          <img
            src={profileDetails.profilePic}
            alt="Profile"
            className="profile-pic"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={profileDetails.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profileDetails.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={profileDetails.bio}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="save-profile-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
}
