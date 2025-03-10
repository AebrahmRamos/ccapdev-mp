import { useState } from "react";
import axios from "axios";
import "../styles/Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    cafeName: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending signup request with data:", formData);
      const response = await axios.post(
        "http://localhost:5500/api/signup",
        formData
      );
      if (response.status === 201) {
        console.log("Signup successful:", response.data);
        alert(`Sign-up successful as ${formData.role}! You can now log in.`);
      } else {
        console.log("Signup failed:", response.data.message);
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1>Create an Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="role">Register as</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select an option</option>
              <option value="Student">Student</option>
              <option value="Cafe Owner">Cafe Owner</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
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
              value={formData.lastName}
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
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {formData.role === "Cafe Owner" && (
            <div className="form-group">
              <label htmlFor="cafeName">Cafe Name</label>
              <input
                type="text"
                id="cafeName"
                name="cafeName"
                value={formData.cafeName}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
