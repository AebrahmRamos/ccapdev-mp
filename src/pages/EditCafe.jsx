import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/EditCafe.css";

export default function EditCafe() {
  const navigate = useNavigate();
  const [cafeDetails, setCafeDetails] = useState({
    name: "",
    address: "",
    operatingHours: {
      Monday: "",
      Tuesday: "",
      Wednesday: "",
      Thursday: "",
      Friday: "",
      Saturday: "",
      Sunday: "",
    },
    photos: [],
    slug: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCafeData = async () => {
      try {
        const response = await axios.get("https://coffee-crawl-ccapdev.vercel.app/api/cafe", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        const { cafe } = response.data;

        setCafeDetails({
          name: cafe.cafeName,
          address: cafe.address,
          operatingHours: cafe.operatingHours,
          photos: cafe.photos || [],
          slug: cafe.slug,
        });
      } catch (error) {
        console.error("Error fetching cafe data:", error);
        alert("Failed to fetch cafe data. Please try again.");
      }
    };

    fetchCafeData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCafeDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOperatingHoursChange = (e) => {
    const { name, value } = e.target;
    setCafeDetails((prev) => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [name]: value,
      },
    }));
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Data = reader.result.split(",")[1];
        const uploadResponse = await axios.post("https://coffee-crawl-ccapdev.vercel.app/api/upload", {
          image: {
            name: `logo-${Date.now()}`,
            type: file.type,
            data: base64Data,
          },
        });

        if (uploadResponse.data.success) {
          setCafeDetails((prev) => {
            // Create a new photos array with the logo as the first element
            const newPhotos = [...prev.photos];
            // Replace the first element (logo) or add it if photos array is empty
            if (newPhotos.length > 0) {
              newPhotos[0] = uploadResponse.data.imageId;
            } else {
              newPhotos.push(uploadResponse.data.imageId);
            }
            return {
              ...prev,
              photos: newPhotos,
            };
          });
        } else {
          throw new Error("Failed to upload logo");
        }
      };
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Failed to upload logo. Please try again.");
    }
  };

  const handlePhotosChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      const uploadPromises = files.map(async (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise((resolve) => {
          reader.onloadend = async () => {
            const base64Data = reader.result.split(",")[1];
            const uploadResponse = await axios.post("https://coffee-crawl-ccapdev.vercel.app/api/upload", {
              image: {
                name: `cafe-photo-${Date.now()}`,
                type: file.type,
                data: base64Data,
              },
            });
            resolve(uploadResponse.data.imageId); // Resolve with image ID
          };
        });
      });

      const newPhotoIds = await Promise.all(uploadPromises);
      setCafeDetails((prev) => ({
        ...prev,
        photos: [...prev.photos, ...newPhotoIds],
      }));
    } catch (error) {
      console.error("Error uploading photos:", error);
      alert("Failed to upload photos. Please try again.");
    }
  };

  const handleRemovePhoto = (index) => {
    // Don't allow removing the logo (first photo)
    if (index === 0) {
      alert("Cannot remove logo. Please upload a new logo instead.");
      return;
    }
    
    setCafeDetails((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(
        `https://coffee-crawl-ccapdev.vercel.app/api/cafes/${cafeDetails.slug}`,
        {
          cafeName: cafeDetails.name,
          address: cafeDetails.address,
          operatingHours: cafeDetails.operatingHours,
          photos: cafeDetails.photos,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Cafe updated successfully!");
        navigate("/profile");
      } else {
        alert("Failed to update cafe.");
      }
    } catch (error) {
      console.error("Error updating cafe:", error);
      alert("An error occurred while updating the cafe.");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "/images/default-cafe-logo.png";
    if (image.startsWith("http") || image.startsWith("data:image")) return image;
    return `https://coffee-crawl-ccapdev.vercel.app/api/images/${image}`;
  };

  return (
    <div className="edit-cafe-page-container">
      <h1 className="title">Edit Your Cafe</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Cafe Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={cafeDetails.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={cafeDetails.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Operating Hours</label>
          {Object.keys(cafeDetails.operatingHours).map((day) => (
            <div key={day} className="form-group">
              <label htmlFor={day}>{day}</label>
              <input
                type="text"
                id={day}
                name={day}
                value={cafeDetails.operatingHours[day]}
                onChange={handleOperatingHoursChange}
                required
              />
            </div>
          ))}
        </div>
        <div className="form-group">
          <label htmlFor="logo">Cafe Logo</label>
          <input
            type="file"
            id="logo"
            name="logo"
            accept="image/*"
            onChange={handleLogoChange}
          />
          {cafeDetails.photos.length > 0 && (
            <img
              src={getImageUrl(cafeDetails.photos[0])}
              alt="Cafe Logo"
              className="logo-preview"
            />
          )}
        </div>
        <div className="form-group">
          <label htmlFor="photos">Additional Photos</label>
          <input
            type="file"
            id="photos"
            name="photos"
            accept="image/*"
            multiple
            onChange={handlePhotosChange}
          />
          <div className="photos-preview">
            {cafeDetails.photos.map((photo, index) => (
              <div key={index} className={`photo-item ${index === 0 ? 'logo-item' : ''}`}>
                <img src={getImageUrl(photo)} alt={index === 0 ? 'Cafe Logo' : `Cafe photo ${index}`} />
                <button
                  type="button"
                  className="remove-photo-btn"
                  onClick={() => handleRemovePhoto(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="save-cafe-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}