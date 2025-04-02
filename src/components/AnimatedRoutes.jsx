import { Routes, Route, useLocation } from "react-router-dom";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import About from "../pages/About";
import Login from "../pages/Login";
import CafePage from "../pages/CafePage";
import ReviewSubmission from "../pages/ReviewSubmission";
import CafeListing from "../pages/CafeListing";

import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import EditCafe from "../pages/EditCafe";
import PrivateRoute from "../components/PrivateRoute";
import CafeOwnerProfile from "../pages/CafeOwnerProfile";
import NotFound from "../pages/NotFound";

import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

function AnimatedRoutes() {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.key}>
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
              <CafeListing />
          }
        />
        <Route
          path="/cafe/:slug"
          element={
              <CafePage />
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
        <Route
          path="/edit-cafe"
          element={
            <PrivateRoute>
              <EditCafe />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              {userData ? (
                userData.role === "Student" ? (
                  <Profile />
                ) : (
                  <CafeOwnerProfile />
                )
              ) : (
                <Login />
              )}
            </PrivateRoute>
          }
        />
        <Route
          path="/cafe-owner"
          element={
            <PrivateRoute>
              <CafeOwnerProfile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
