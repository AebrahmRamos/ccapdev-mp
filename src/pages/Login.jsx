import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";
import { motion } from "framer-motion";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      console.log("Sending login request with data:", formData);
      // Normalize email to lowercase
      const normalizedFormData = {
        ...formData,
        email: formData.email.toLowerCase(),
      };

      const response = await axios.post(
        "https://coffee-crawl-ccapdev.vercel.app/api/login",
        normalizedFormData
      );

      console.log("Full response data:", response.data);

      if (response.status === 200) {
        console.log("Login successful:", response.data.message);
        // Store the token
        localStorage.setItem("authToken", response.data.token);
        // Optionally store user data
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        navigate("/");
      } else {
        console.log("Login failed:", response.data.message);
        setError(response.data.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="login-box">
        <h1>Welcome Back</h1>
        <form onSubmit={handleSubmit}>
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
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
        <p className="signup-link">
          Don&apos;t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
