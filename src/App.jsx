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
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/submit-review" element={<ReviewSubmission />} />
          {cafeData.map((cafe) => (
            <Route
              key={cafe.id}
              path={`/cafe/${cafe.id}`}
              element={<CafePage cafe={cafe} />}
            />
          ))}
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
