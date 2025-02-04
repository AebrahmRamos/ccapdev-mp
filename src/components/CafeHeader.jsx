import React from 'react';
import styles from '../styles/CafeDetails.module.css';

export function CafeHeader() {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <div className={styles.headerLayout}>
          <div className={styles.infoColumn}>
            <div className={styles.titleSection}>
              <h1 className={styles.cafeName}>Elsewhere Cafe</h1>
              <div className={styles.ratingContainer}>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/2e3cb4ba77b7a9e43e6a58691e9e2f820eebd3eb5244d80c29a4fe52a539c84e?placeholderIfAbsent=true&apiKey=99eff07de93a442a8e01c5af4301b6ea"
                  alt="Rating stars"
                  className={styles.ratingStars}
                />
                <span className={styles.ratingScore}>(4.5)</span>
                <span className={styles.reviewCount}>Total Reviews: 100</span>
              </div>
            </div>
            <div className={styles.hoursSection}>
              Opening Hours: Monday 12–9 PM Tuesday 12–9 PM
              <br /> Wednesday 12–9 PM
              <br /> Thursday 12–9 PM
              <br /> Friday 12–9 PM
              <br /> Saturday 12–9 PM
              <br /> Sunday Closed
            </div>
          </div>
          <div className={styles.imageColumn}>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/441df944f89b1d42fae295cc1d179c48b2e18c834fd5149099c651b7f04a47ad?placeholderIfAbsent=true&apiKey=99eff07de93a442a8e01c5af4301b6ea"
              alt="Elsewhere Cafe exterior"
              className={styles.cafeImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}