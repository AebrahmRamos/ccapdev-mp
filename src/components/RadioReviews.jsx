import React from 'react';
import '../styles/RadioReviews.css';

const RadioReviews = ({ cafeDetails, onChange }) => {
  return (
    <div className="cafe-details-section">
      <div className="ambience-section">
        <div className="radio-group">
          <label>Ambience:</label>
          <label>
            <input 
              type="radio" 
              name="ambience" 
              value="cozy"
              checked={cafeDetails.ambience === 'study-friendly'}
              onChange={onChange}
            /> Cozy
          </label>
          <label>
            <input 
              type="radio" 
              name="ambience" 
              value="lively"
              checked={cafeDetails.ambience === 'social'}
              onChange={onChange}
            /> Lively
          </label>
        </div>
      </div>

      <div className="pricing-section">
        <div className="radio-group">
          <label>Pricing:</label>
          <label>
            <input 
              type="radio" 
              name="pricing" 
              value="cheap"
              checked={cafeDetails.pricing === 'cheap'}
              onChange={onChange}
            /> Cheap
          </label>
          <label>
            <input 
              type="radio" 
              name="pricing" 
              value="affordable"
              checked={cafeDetails.pricing === 'affordable'}
              onChange={onChange}
            /> Affordable
          </label>
          <label>
            <input 
              type="radio" 
              name="pricing" 
              value="expensive"
              checked={cafeDetails.pricing === 'expensive'}
              onChange={onChange}
            /> Expensive
          </label>
        </div>
      </div>

      <div className="wifi-section">
        <div className="radio-group">
          <label>WiFi Quality:</label>
          <label>
            <input 
              type="radio" 
              name="wifi" 
              value="fast & stable"
              checked={cafeDetails.wifi === 'yes'}
              onChange={onChange}
            /> Fast & Stable
          </label>
          <label>
            <input 
              type="radio" 
              name="wifi" 
              value="slow"
              checked={cafeDetails.wifi === 'no'}
              onChange={onChange}
            /> Slow
          </label>
          <label>
            <input 
              type="radio" 
              name="wifi" 
              value="no wifi"
              checked={cafeDetails.wifi === 'no'}
              onChange={onChange}
            /> No WiFi
          </label>
        </div>
      </div>

      <div className="outlets-section">
        <div className="radio-group">
          <label>Outlets:</label>
          <label>
            <input 
              type="radio" 
              name="outlets" 
              value="plenty"
              checked={cafeDetails.outlets === 'yes'}
              onChange={onChange}
            /> Plenty
          </label>
          <label>
            <input 
              type="radio" 
              name="outlets" 
              value="limited"
              checked={cafeDetails.outlets === 'no'}
              onChange={onChange}
            /> Limited
          </label>
          <label>
            <input 
              type="radio" 
              name="outlets" 
              value="none"
              checked={cafeDetails.outlets === 'no'}
              onChange={onChange}
            /> None
          </label>
        </div>
      </div>

      <div className="seating-section">
        <div className="radio-group">
          <label>Seating:</label>
          <label>
            <input 
              type="radio" 
              name="seating" 
              value="spacious"
              checked={cafeDetails.seating === 'yes'}
              onChange={onChange}
            /> Spacious
          </label>
          <label>
            <input 
              type="radio" 
              name="seating" 
              value="cramped"
              checked={cafeDetails.seating === 'no'}
              onChange={onChange}
            /> Cramped
          </label>
        </div>
      </div>
    </div>
  );
};

export default RadioReviews;