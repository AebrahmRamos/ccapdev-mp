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


export default CafeCard;