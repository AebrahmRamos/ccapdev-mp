import React from 'react';
import styles from '../styles/CafeDetails.module.css';

export function CafeDetails() {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <div className={styles.headerLayout}>
          <div className={styles.infoColumn}>
            <div className={styles.titleSection}>
              <h1 className={styles.cafeName}>Elsewhere Cafe</h1>
              <div className={styles.ratingContainer}>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/2e3cb4ba77b7a9e43e6a58691e9e2f820eebd3eb5244d80c29a4fe52a539c84e"
                  alt="Rating stars"
                  className={styles.ratingStars}
                />
                <span className={styles.ratingScore}>(4.5)</span>
                <span className={styles.reviewCount}>Total Reviews: 100</span>
              </div>
            </div>
            <div className={styles.address}>
              <span>
                Address: 3/F, 2510 Taft Ave, Malate, Manila, 1004 Metro Manila
              </span>
            </div>
            <div className={styles.hoursSection}>
              <div className={styles.hoursTitle}>Opening Hours:</div>
              <div className={styles.hoursList}>
                <div className={styles.hoursDay}>
                  <span>Monday</span>
                  <span>Tuesday</span>
                  <span>Wednesday</span>
                  <span>Thursday</span>
                  <span>Friday</span>
                  <span>Saturday</span>
                  <span>Sunday</span>
                </div>
                <div className={styles.hoursTime}>
                  <span> 12–9 PM</span>
                  <span> 12–9 PM</span>
                  <span> 12–9 PM</span>
                  <span> 12–9 PM</span>
                  <span> 12–9 PM</span>
                  <span> 12–9 PM</span>
                  <span> Closed</span>
                </div>
              </div>      
            </div>
          </div>
          <div className={styles.imageColumn}>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/441df944f89b1d42fae295cc1d179c48b2e18c834fd5149099c651b7f04a47ad"
              alt="Elsewhere Cafe exterior"
              className={styles.cafeImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}