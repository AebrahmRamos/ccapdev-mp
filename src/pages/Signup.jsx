import { useState } from "react";
import axios from "axios";
import "../styles/Signup.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    cafeName: "",
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
  });

  const [operatingHoursErrors, setOperatingHoursErrors] = useState({
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
    Sunday: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const operatingHoursRegex =
    /^((\d{1,2}(:\d{2})? (AM|PM) - \d{1,2}(:\d{2})? (AM|PM))|Closed)$/i;

  const validateOperatingHours = (value) => {
    if (!value) return "";
    if (value.toLowerCase() === "closed") return "";

    if (!operatingHoursRegex.test(value)) {
      return "Invalid format. Use '9 AM - 5 PM' or 'Closed'";
    }

    const parts = value.split(" - ");
    if (parts.length === 2) {
      const startTime = parts[0].trim();
      const endTime = parts[1].trim();

      if (!isValidTimeRange(startTime, endTime)) {
        return "Invalid time range. End time must be later than start time.";
      }
    }

    return "";
  };

  const isValidTimeRange = (startTime, endTime) => {
    const start = convertTo24Hour(startTime);
    const end = convertTo24Hour(endTime);

    if (start === null || end === null) {
      return false;
    }

    return end > start;
  };

  const convertTo24Hour = (time) => {
    const [timeValue, ampm] = time.split(" ");
    const [hours, minutes] = timeValue.split(":");

    let hour = parseInt(hours);
    const minute = minutes ? parseInt(minutes) : 0;

    if (isNaN(hour) || isNaN(minute)) {
      return null;
    }

    if (ampm.toLowerCase() === "pm" && hour !== 12) {
      hour += 12;
    } else if (ampm.toLowerCase() === "am" && hour === 12) {
      hour = 0;
    }

    return hour + minute / 60;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPasswordError(
        value.length < 6 ? "Password must be at least 6 characters long." : ""
      );
    }
    if (name.startsWith("operatingHours.")) {
      const day = name.split(".")[1];
      const error = validateOperatingHours(value);
      setOperatingHoursErrors((prevErrors) => ({
        ...prevErrors,
        [day]: error,
      }));
      setFormData((prevState) => ({
        ...prevState,
        operatingHours: {
          ...prevState.operatingHours,
          [day]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordError) {
      setErrorMessage("Please correct the password error.");
      return;
    }

    if (Object.values(operatingHoursErrors).some((error) => error !== "")) {
      setErrorMessage("Please correct the operating hours errors.");
      return;
    }

    try {
      console.log("Sending signup request with data:", formData);
      let signupEndpoint = "";
      const signupData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };

      if (formData.role === "Student") {
        signupEndpoint = "https://coffee-crawl-ccapdev.vercel.app/api/signup/student";
      } else if (formData.role === "Cafe Owner") {
        signupEndpoint = "https://coffee-crawl-ccapdev.vercel.app/api/signup/cafe-owner";
        signupData.cafeName = formData.cafeName;
        signupData.address = formData.address;
        signupData.operatingHours = formData.operatingHours;
      }

      if (signupEndpoint) {
        const response = await axios.post(signupEndpoint, signupData);

        if (response.status === 201) {
          console.log("Signup successful:", response.data);
          alert(`Sign-up successful as ${formData.role}!`);
          navigate("/login");
        } else {
          console.log("Signup failed:", response.data.message);
          setErrorMessage(response.data.message);
        }
      } else {
        setErrorMessage("Please select a role to sign up as.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      const errorMsg =
        error.response?.data?.message || "An error occurred. Please try again.";
      setErrorMessage(errorMsg);
    }
  };

  return (
    <motion.div
      className="signup-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
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
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>

          {formData.role === "Cafe Owner" && (
            <>
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

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Operating Hours</label>
                <div className="operating-hours">
                  <div className="day-hours">
                    <label htmlFor="mondayHours">Monday</label>
                    <input
                      type="text"
                      id="mondayHours"
                      name="operatingHours.Monday"
                      value={formData.operatingHours.Monday}
                      onChange={handleChange}
                      placeholder="9 AM - 5 PM or Closed"
                    />
                    {operatingHoursErrors.Monday && (
                      <p className="error-message">
                        {operatingHoursErrors.Monday}
                      </p>
                    )}
                  </div>
                  <div className="day-hours">
                    <label htmlFor="tuesdayHours">Tuesday</label>
                    <input
                      type="text"
                      id="tuesdayHours"
                      name="operatingHours.Tuesday"
                      value={formData.operatingHours.Tuesday}
                      onChange={handleChange}
                      placeholder="9 AM - 5 PM or Closed"
                    />
                    {operatingHoursErrors.Tuesday && (
                      <p className="error-message">
                        {operatingHoursErrors.Tuesday}
                      </p>
                    )}
                  </div>
                  <div className="day-hours">
                    <label htmlFor="wednesdayHours">Wednesday</label>
                    <input
                      type="text"
                      id="wednesdayHours"
                      name="operatingHours.Wednesday"
                      value={formData.operatingHours.Wednesday}
                      onChange={handleChange}
                      placeholder="9 AM - 5 PM or Closed"
                    />
                    {operatingHoursErrors.Wednesday && (
                      <p className="error-message">
                        {operatingHoursErrors.Wednesday}
                      </p>
                    )}
                  </div>
                  <div className="day-hours">
                    <label htmlFor="thursdayHours">Thursday</label>
                    <input
                      type="text"
                      id="thursdayHours"
                      name="operatingHours.Thursday"
                      value={formData.operatingHours.Thursday}
                      onChange={handleChange}
                      placeholder="9 AM - 5 PM or Closed"
                    />
                    {operatingHoursErrors.Thursday && (
                      <p className="error-message">
                        {operatingHoursErrors.Thursday}
                      </p>
                    )}
                  </div>
                  <div className="day-hours">
                    <label htmlFor="fridayHours">Friday</label>
                    <input
                      type="text"
                      id="fridayHours"
                      name="operatingHours.Friday"
                      value={formData.operatingHours.Friday}
                      onChange={handleChange}
                      placeholder="9 AM - 5 PM or Closed"
                    />
                    {operatingHoursErrors.Friday && (
                      <p className="error-message">
                        {operatingHoursErrors.Friday}
                      </p>
                    )}
                  </div>
                  <div className="day-hours">
                    <label htmlFor="saturdayHours">Saturday</label>
                    <input
                      type="text"
                      id="saturdayHours"
                      name="operatingHours.Saturday"
                      value={formData.operatingHours.Saturday}
                      onChange={handleChange}
                      placeholder="9 AM - 5 PM or Closed"
                    />
                    {operatingHoursErrors.Saturday && (
                      <p className="error-message">
                        {operatingHoursErrors.Saturday}
                      </p>
                    )}
                  </div>
                  <div className="day-hours">
                    <label htmlFor="sundayHours">Sunday</label>
                    <input
                      type="text"
                      id="sundayHours"
                      name="operatingHours.Sunday"
                      value={formData.operatingHours.Sunday}
                      onChange={handleChange}
                      placeholder="9 AM - 5 PM or Closed"
                    />
                    {operatingHoursErrors.Sunday && (
                      <p className="error-message">
                        {operatingHoursErrors.Sunday}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
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
    </motion.div>
  );
};

export default Signup;
