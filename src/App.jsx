import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import CafePage from "./pages/CafePage";
import ReviewSubmission from "./pages/ReviewSubmission";
import cafeData from "./data/Cafes.json";
import CafeListing from "./pages/CafeListing";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import NewPage from "./pages/NewPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/submit-review" element={<ReviewSubmission />} />
            <Route path="/newpage" element={<NewPage />}/>
            <Route path="/cafes" element={<CafeListing />} />
            {cafeData.map((cafe) => (
              <Route
                key={cafe.id}
                path={`/cafe/${cafe.id}`}
                element={<CafePage cafe={cafe} />}
              />
            ))}
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
