import { Link } from 'react-router-dom';
import '../styles/Hero.css';

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Discover The Best Cafes Around DLSU</h1>
        <Link to="/signup" className="cta-button">Sign Up Now</Link>
      </div>
    </div>
  );
};

export default Hero;
