import { useState, useEffect } from "react";
import "../styles/ReviewSubmission.css";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ReviewSubmission = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cafes, setCafes] = useState([]);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [ratings, setRatings] = useState({
    ambiance: 0,
    drinkQuality: 0,
    service: 0,
    wifiReliability: 0,
    cleanliness: 0,
    valueForMoney: 0,
  });
  const [hover, setHover] = useState({
    ambiance: 0,
    drinkQuality: 0,
    service: 0,
    wifiReliability: 0,
    cleanliness: 0,
    valueForMoney: 0,
  });
  const [photos, setPhotos] = useState([]);
  const [photoDataUrls, setPhotoDataUrls] = useState([]);
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch all cafes when the component mounts
  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const response = await axios.get("https://coffee-crawl-ccapdev.vercel.app/api/cafes");
        setCafes(response.data);
      } catch (err) {
        console.error("Error fetching cafes:", err);
        setError("Failed to load cafes");
      }
    };

    fetchCafes();
  }, []);

  useEffect(() => {
    // Get user ID and role from local storage or auth context
    const getCurrentUser = () => {
      const user = localStorage.getItem("userData");
      if (user) {
        const userData = JSON.parse(user);
        setUserId(userData._id);
        setUserRole(userData.role);
      }
    };

    getCurrentUser();
  }, []);

  const handleCafeSelect = (e) => {
    const selectedCafeId = e.target.value;
    const cafe = cafes.find((cafe) => cafe._id === selectedCafeId);
    setSelectedCafe(cafe);
  };

  const handleRatingClick = (category, value) => {
    setRatings((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);

    // Clear previous preview URLs
    setPhotoDataUrls([]);

    // Generate preview URLs for all selected files
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoDataUrls((prevUrls) => [...prevUrls, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const calculateAverageRating = () => {
    const sum = Object.values(ratings).reduce((acc, curr) => acc + curr, 0);
    return sum / Object.keys(ratings).length;
  };

  const uploadSingleImage = async (file, index) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          const dataUrl = event.target.result;
          const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);

          if (!matches || matches.length !== 3) {
            reject(new Error("Invalid image format"));
            return;
          }

          const imageType = matches[1];
          const base64Data = matches[2];

          const uploadResponse = await axios.post(
            "https://coffee-crawl-ccapdev.vercel.app/api/upload",
            {
              image: {
                name: `review-${Date.now()}-${index}`,
                type: imageType,
                data: base64Data,
              },
            }
          );

          if (uploadResponse.data.success) {
            resolve(uploadResponse.data.imageId);
          } else {
            reject(new Error("Failed to upload image"));
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error("Error reading file"));
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError("You must be logged in to submit a review");
      return;
    }

    if (!selectedCafe) {
      setError("Please select a cafe to review");
      return;
    }

    // Validate ratings
    const hasAllRatings = Object.values(ratings).every((rating) => rating > 0);
    if (!hasAllRatings) {
      setError("Please provide ratings for all categories");
      return;
    }

    try {
      setIsLoading(true);
      setUploadProgress(0);

      // Upload all photos in parallel
      const photoIds = [];
      const totalPhotos = photos.length;

      if (totalPhotos > 0) {
        const uploadPromises = photos.map((file, index) => {
          return uploadSingleImage(file, index).then((imageId) => {
            photoIds.push(imageId);
            setUploadProgress(
              Math.round((photoIds.length / totalPhotos) * 100)
            );
            return imageId;
          });
        });

        // Wait for all uploads to complete
        await Promise.all(uploadPromises);
      }

      // Create review object
      const reviewData = {
        cafeId: selectedCafe._id,
        userId,
        rating: ratings,
        textReview: reviewText,
        photos: photoIds,
        videos: [],
      };

      // Submit review
      const response = await axios.post(
        "https://coffee-crawl-ccapdev.vercel.app/api/reviews",
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      console.log(response.data);

      setIsLoading(false);
      setUploadProgress(0);
      alert("Review submitted successfully!");
      navigate(`/cafe/${selectedCafe.slug}`);
    } catch (err) {
      setIsLoading(false);
      setUploadProgress(0);
      setError("Failed to submit review. Please try again.");
      console.error("Error submitting review:", err);
    }
  };

  const ratingCategories = [
    { key: "ambiance", label: "Ambiance" },
    { key: "drinkQuality", label: "Drink Quality" },
    { key: "service", label: "Service" },
    { key: "wifiReliability", label: "WiFi Reliability" },
    { key: "cleanliness", label: "Cleanliness" },
    { key: "valueForMoney", label: "Value for Money" },
  ];

  // Remove a photo from the selection
  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoDataUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      className="review-submission-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1>Submit Your Review</h1>
      {error && <div className="error-message">{error}</div>}

      {userRole === "Student" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (reviewText.length < 20) {
              setError("Review must be at least 20 characters long");
              return;
            }
            handleSubmit(e);
          }}
        >
          <div className="cafe-search-section">
            <label htmlFor="cafeSelect">Select a Cafe</label>
            <select id="cafeSelect" onChange={handleCafeSelect} required>
              <option value="">Select a cafe...</option>
              {cafes.map((cafe) => (
                <option key={cafe._id} value={cafe._id}>
                  {cafe.cafeName}
                </option>
              ))}
            </select>
          </div>

          {selectedCafe && (
            <div className="selected-cafe-info">
              <h3>{selectedCafe.cafeName}</h3>
            </div>
          )}

          {/* Rating sections */}
          {ratingCategories.map((category) => (
            <div className="rating-section" key={category.key}>
              <label>{category.label}</label>
              <div className="star-rating">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <FaStar
                      key={ratingValue}
                      className={
                        ratingValue <=
                        (hover[category.key] || ratings[category.key])
                          ? "star active"
                          : "star"
                      }
                      onClick={() =>
                        handleRatingClick(category.key, ratingValue)
                      }
                      onMouseEnter={() =>
                        setHover((prev) => ({
                          ...prev,
                          [category.key]: ratingValue,
                        }))
                      }
                      onMouseLeave={() =>
                        setHover((prev) => ({ ...prev, [category.key]: 0 }))
                      }
                    />
                  );
                })}
              </div>
            </div>
          ))}

          <div className="overall-rating">
            <label>Overall Rating</label>
            <div className="rating-display">
              {calculateAverageRating().toFixed(1)} / 5
            </div>
          </div>

          <div className="review-text-section">
            <label htmlFor="reviewText">Your Review</label>
            <textarea
              id="reviewText"
              placeholder="Write your review here (minimum 20 characters)..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
              rows={5}
            />
            <div className="character-count">
              Characters: {reviewText.length}{" "}
              {reviewText.length < 20 && "(Min: 20)"}
            </div>
          </div>

          <div className="photo-upload-section">
            <label htmlFor="photoUpload">Add Photos (Optional)</label>
            <input
              type="file"
              id="photoUpload"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
            />

            {/* Photo previews */}
            {photoDataUrls.length > 0 && (
              <div className="photo-upload-container">
                <div className="photo-previews">
                  {photoDataUrls.map((url, index) => (
                    <div key={index} className="photo-preview-item">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="photo-preview-thumbnail"
                      />
                      <button
                        type="button"
                        className="remove-photo-btn"
                        onClick={() => removePhoto(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="photo-count">
                  {photoDataUrls.length} photo
                  {photoDataUrls.length !== 1 ? "s" : ""} selected
                </div>
              </div>
            )}

            {/* Upload progress indicator */}
            {isLoading && uploadProgress > 0 && (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  Uploading photos: {uploadProgress}%
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="submit-review-btn"
            disabled={isLoading || !selectedCafe || reviewText.length < 20}
          >
            {isLoading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <div className="error-message">
          Only students are allowed to submit reviews.
        </div>
      )}
    </motion.div>
  );
};

export default ReviewSubmission;
