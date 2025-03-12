import React, { useState, useEffect } from "react";
import styles from "../styles/CafeDetails.module.css";
import api from "../utils/axiosConfig";

function ReviewCard({
  user,
  date,
  userId, // Add userId to fetch the user's profile image
  textReview,
  rating,
  photos,
  videos,
}) {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    const fetchUserProfileImage = async () => {
      try {
        const response = await api.get(`http://localhost:5500/api/users/${userId}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch user data");
        }
        const userData = response.data;
        setProfileImage(userData.profilePicture); // Assuming the profile image URL is stored in `profilePicture` field
        setName(`${userData.firstName} ${userData.lastName}`); // Assuming the user's name is stored in `firstName` and `lastName` fields
      } catch (error) {
        console.error("Error fetching user profile image:", error);
      }
    };

    fetchUserProfileImage();
  }, [userId]);

  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewHeader}>
        <img
          src={profileImage || "/default-profile-image.png"} // Use a default image if profileImage is null
          alt={`${name}'s profile`}
          className={styles.reviewerImage}
        />
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <div className={styles.reviewerInfo}>
            <div className={styles.reviewerMeta}>
              <span>{name}</span>
              <span>{new Date(date).toLocaleDateString()}</span>
            </div>
          </div>
          <div className={styles.amenityDetails}>
            <div><strong>Ambiance:</strong> {rating.ambiance}</div>
            <div><strong>Drink Quality:</strong> {rating.drinkQuality}</div>
            <div><strong>Service:</strong> {rating.service}</div>
            <div><strong>Wi-Fi Reliability:</strong> {rating.wifiReliability}</div>
            <div><strong>Cleanliness:</strong> {rating.cleanliness}</div>
            <div><strong>Value for Money:</strong> {rating.valueForMoney}</div>
          </div>
        </div>
      </div>

      <p className={styles.reviewText}>{textReview}</p>
      {(photos.length > 0 || videos.length > 0) && (
        <div className={styles.reviewMedia}>
          {photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`Review photo ${index + 1}`}
              className={styles.reviewImage}
            />
          ))}
          {videos.map((video, index) => (
            <video key={index} controls className={styles.reviewVideo}>
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ))}
        </div>
      )}
      <button className={styles.helpfulButton} tabIndex={0}>
        Was this review helpful? 👍🏻
      </button>
    </div>
  );
}

function ReviewsSection({ reviews }) {
  return (
    <div className={styles.reviewsSection}>
      <h2 className={styles.reviewsTitle}>Reviews</h2>
      <div className={styles.reviewsList}>
        {Array.isArray(reviews) && reviews.map((review, index) => (
          <ReviewCard key={index} {...review} userId={review.userId} /> // Pass userId to ReviewCard
        ))}
      </div>
    </div>
  );
}

export default ReviewsSection;