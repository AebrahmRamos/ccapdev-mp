import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import CafePage from "./pages/CafePage";
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
          {cafeData.map((cafe) => (
            <Route
              key={cafe.id}
              path={`/cafe/${cafe.id}`}
              element={<CafePage cafe={cafe} />}
            />
          ))}
        </Routes>
      </div>
    </Router>
  );
}

export default App;