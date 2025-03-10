import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import CafePage from "./pages/CafePage";
import ReviewSubmission from "./pages/ReviewSubmission";
import CafeListing from "./pages/CafeListing";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

function App() {
  const [cafes, setCafes] = useState([]);

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const response = await fetch("/api/cafes");
        const data = await response.json();
        setCafes(data.cafes);
      } catch (error) {
        console.error("Error fetching cafes:", error);
      }
    };

    fetchCafes();
  }, []);

  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/submit-review"
              element={
                <PrivateRoute>
                  <ReviewSubmission />
                </PrivateRoute>
              }
            />
            <Route
              path="/cafe"
              element={
                <PrivateRoute>
                  <CafeListing />
                </PrivateRoute>
              }
            />
            <Route
              path="/cafe/:slug"
              element={
                <PrivateRoute>
                  <CafePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <PrivateRoute>
                  <EditProfile />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;