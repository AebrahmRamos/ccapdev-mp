import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/EditProfile.css";
import { motion } from "framer-motion";

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

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileDetails((prev) => ({
          ...prev,
          profilePic: reader.result, // Temporarily store as data URL
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData) {
        alert("User data not found. Please log in again.");
        return;
      }

      let profilePicture = profileDetails.profilePic;

      // Handle image upload if new image was selected
      if (profilePicture.startsWith("data:image")) {
        const matches = profilePicture.match(/^data:(.+);base64,(.+)$/);
        const imageType = matches[1];
        const base64Data = matches[2];

        // Upload image
        const uploadResponse = await axios.post(
          "http://localhost:5500/api/upload",
          {
            image: {
              name: `profile-${Date.now()}`,
              type: imageType,
              data: base64Data,
            },
          }
        );

        if (uploadResponse.data.success) {
          profilePicture = uploadResponse.data.imageId;
        } else {
          throw new Error("Failed to upload image");
        }
      }

      // Update user data
      const response = await axios.put(
        `http://localhost:5500/api/users/${userData._id}`,
        {
          firstName: profileDetails.firstName,
          lastName: profileDetails.lastName,
          email: profileDetails.email,
          profilePicture,
          bio: profileDetails.bio,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status === 200) {
        // Update local storage with new data
        const updatedUser = response.data.user;
        localStorage.setItem("userData", JSON.stringify(updatedUser));

        // Update local state with new image URL if needed
        setProfileDetails((prev) => ({
          ...prev,
          profilePic: updatedUser.profilePicture,
        }));

        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <motion.div
      className="edit-profile-page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
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
    </motion.div>
  );
}
