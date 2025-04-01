import "../styles/About.css";
import { motion } from "framer-motion";
import { useState } from "react";

const About = () => {
  const [showLibraries, setShowLibraries] = useState(false);

  const libraries = [
    "React",
    "Framer Motion",
    "React Router DOM",
    "React Router",
    "Axios",
    "Bootstrap",
    "Node.js",
    "Express",
    "MongoDB",
    "Mongoose",
    "bycrypt",
    "jsonwebtoken",
    "dotenv",
    "lodash",
    "prop-types",
    "cors",
    "react-icons",
    "jwt-decode",
    "express-validator",
  ];

  const toggleLibraries = () => {
    setShowLibraries(!showLibraries);
  };

  return (
    <motion.div
      className="about-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1>About DLSU Coffee Crawl</h1>
      <div className="about-content">
        <section className="mission">
          <h2>Our Mission</h2>
          <p>
            DLSU Coffee Crawl is dedicated to helping students, faculty, and
            coffee enthusiasts discover the best coffee spots around De La Salle
            University. We believe that great coffee enhances productivity and
            creates memorable experiences.
          </p>
        </section>

        <section className="features">
          <h2>What We Offer</h2>
          <ul>
            <li>Curated lists of the best cafes near DLSU</li>
            <li>Study-friendly environment recommendations</li>
            <li>Detailed reviews and ratings</li>
            <li>Up-to-date information on operating hours</li>
          </ul>
        </section>

        <section className="libraries">
          <h2 onClick={toggleLibraries} style={{ cursor: "pointer" }}>
            Libraries and Packages {showLibraries ? "▲" : "▼"}
          </h2>
          <ul className={showLibraries ? "show" : ""}>
            {libraries.map((library, index) => (
              <li key={index}>{library}</li>
            ))}
          </ul>
        </section>

        <section className="contact">
          <h2>Contact Us</h2>
          <p>
            Feel free to reach out to us through the following contact details:
          </p>
          <div className="contact-details">
            <div className="contact-item">
              <h3>Email</h3>
              <p>cafecrawl_dlsu@gmail.com</p>
            </div>
            <div className="contact-item">
              <h3>Contact Number</h3>
              <p>+63 961 755 7202</p>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default About;
