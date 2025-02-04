import { useState } from "react";
import "../styles/Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    role: "", 
    firstName: "",
    lastName: "",
    email: "",
    password: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("New User Registered:", formData);
    alert(`Sign-up successful as ${formData.role}! You can now log in.`);
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1>Create an Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="role">Register as</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange} required>
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

          <button type="submit" className="signup-button">Sign Up</button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
