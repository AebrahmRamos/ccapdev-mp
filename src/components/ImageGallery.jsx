import React, { useState } from 'react';
import styles from '../styles/CafeDetails.module.css';

export function ImageGallery({ images }) {
  const IMAGES_PER_VIEW = 4;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      return newIndex < 0 ? Math.max(0, images.length - IMAGES_PER_VIEW) : newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      return newIndex > images.length - IMAGES_PER_VIEW ? 0 : newIndex;
    });
  };

  const visibleImages = images.slice(currentIndex, currentIndex + IMAGES_PER_VIEW);

  // Handle edge cases where images.length < IMAGES_PER_VIEW
  const displayImages = images.length < IMAGES_PER_VIEW ? images : visibleImages;


  return (
    <div className={styles.galleryWrapper}>
      {images.length > IMAGES_PER_VIEW && ( // Conditionally render buttons
        <button
          onClick={handlePrevious}
          className={styles.galleryButton}
          aria-label="Previous images"
        >
          &lt;
        </button>
      )}
      <div className={styles.galleryContainer}>
        {displayImages.map((image, index) => (
          <div key={`${currentIndex}-${index}`} className={styles.galleryItem}>
            <img
              src={image}
              alt={`Cafe interior view ${index + 1}`}
              className={styles.galleryImage}
            />
          </div>
        ))}
      </div>
       {images.length > IMAGES_PER_VIEW && ( // Conditionally render buttons
        <button
          onClick={handleNext}
          className={styles.galleryButton}
          aria-label="Next images"
        >
          &gt;
        </button>
      )}
    </div>
  );
}