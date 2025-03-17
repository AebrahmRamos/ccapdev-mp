import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/EditProfile.css";

export default function EditProfile() {
  const [profileDetails, setProfileDetails] = useState({
    profilePic: "https://cdn-icons-png.flaticon.com/512/147/147285.png",
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    // Retrieve user data from local storage
    const userData = localStorage.getItem("userData");
    if (userData) {
      const user = JSON.parse(userData);
      setProfileDetails({
        profilePic:
          user.profilePicture ||
          "https://cdn-icons-png.flaticon.com/512/147/147285.png",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        bio: user.bio || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleProfilePicChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setProfileDetails((prev) => ({
  //         ...prev,
  //         profilePic: reader.result,
  //       }));
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Retrieve user data from local storage
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData) {
        alert("User data not found. Please log in again.");
        return;
      }

      // Prepare the request payload
      const payload = {
        userId: userData._id,
        profilePic: profileDetails.profilePic,
        firstName: profileDetails.firstName,
        lastName: profileDetails.lastName,
        email: profileDetails.email,
        bio: profileDetails.bio,
      };

      // Send the PUT request to update the profile
      const response = await axios.put(
        `http://localhost:5500/api/users/${userData._id}`, // Include the user ID in the URL
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status === 200) {
        // Update local storage with the new user data
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message); // Show specific error message from the server
      } else {
        alert("An error occurred while updating the profile.");
      }
    }
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
            // onChange={handleProfilePicChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={profileDetails.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={profileDetails.lastName}
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