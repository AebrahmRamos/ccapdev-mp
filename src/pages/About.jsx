import '../styles/About.css';

const About = () => {
  return (
    <div className="about-container">
      <h1>About DLSU Coffee Crawl</h1>
      <div className="about-content">
        <section className="mission">
          <h2>Our Mission</h2>
          <p>
            DLSU Coffee Crawl is dedicated to helping students, faculty, and coffee enthusiasts
            discover the best coffee spots around De La Salle University. We believe that great
            coffee enhances productivity and creates memorable experiences.
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
      </div>
    </div>
  );
};

export default About;
