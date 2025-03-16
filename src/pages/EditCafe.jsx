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
  });

  useEffect(() => {
    // Retrieve cafe data from the backend
    const fetchCafeData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const response = await axios.get("http://localhost:5500/api/cafe", {
          params: { email: userData.email },
        });

        const { cafe } = response.data;

        setCafeDetails({
          name: cafe.cafeName,
          address: cafe.address,
          operatingHours: cafe.operatingHours,
          photos: cafe.photos,
        });
      } catch (error) {
        console.error("Error fetching cafe data:", error);
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

  const handlePhotosChange = (e) => {
    const files = Array.from(e.target.files);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCafeDetails((prev) => ({
        ...prev,
        photos: [...prev.photos, reader.result],
      }));
    };
    files.forEach((file) => reader.readAsDataURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const response = await axios.put("http://localhost:5500/api/cafe", {
        email: userData.email,
        cafeName: cafeDetails.name,
        address: cafeDetails.address,
        operatingHours: cafeDetails.operatingHours,
        photos: cafeDetails.photos,
      });

      if (response.status === 200) {
        alert("Cafe updated successfully!");
        navigate("/profile");
      } else {
        alert("Failed to update cafe.");
      }
    } catch (error) {
      console.error("Error updating cafe:", error);
      alert("An error occurred while updating the cafe.");
    }
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
          <label htmlFor="photos">Photos</label>
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
              <img key={index} src={photo} alt={`Cafe photo ${index + 1}`} />
            ))}
          </div>
        </div>
        <button type="submit" className="save-cafe-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
}
