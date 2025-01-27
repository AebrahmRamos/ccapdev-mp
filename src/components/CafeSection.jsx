import PropTypes from "prop-types";
import "../styles/CafeSection.css";

const CafeCard = ({ image, title }) => (
  <div className="cafe-card">
    <img src={image} alt={title} />
    <h3>{title}</h3>
  </div>
);


CafeCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

const CafeSection = ({ title, subtitle, cafes }) => {
  return (
    <section className="cafe-section">
      <div className="section-header">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <div className="cafe-grid">
        {cafes.map((cafe, index) => (
          <CafeCard key={index} {...cafe} />
        ))}
      </div>
    </section>
  );
};

CafeSection.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  cafes: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CafeSection;
