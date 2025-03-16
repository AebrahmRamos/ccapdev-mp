import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="logo">
          DLSU Coffee Crawl
        </Link>
      </div>
      <button className="menu-button" onClick={toggleMenu}>
        ☰
      </button>
      <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <Link to="/" onClick={() => setIsMenuOpen(false)}>
          Home
        </Link>
        <Link to="/about" onClick={() => setIsMenuOpen(false)}>
          About
        </Link>
        <Link to="/submit-review" onClick={() => setIsMenuOpen(false)}>
          Submit
        </Link>
        <Link to="/cafe" onClick={() => setIsMenuOpen(false)}>
          Cafes
        </Link>
        <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
          Profile
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
