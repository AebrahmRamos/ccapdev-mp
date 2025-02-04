import React from 'react';
import styles from '../styles/CafeDetails.module.css';
import { CafeDetails } from '../components/CafeDetails';
import { ImageGallery } from '../components/ImageGallery';
import { ReviewsSection } from '../components/ReviewsSection';

const reviews = [
  {
    name: "Philip Gumapos",
    date: "2 Days Ago",
    rating: 4.0,
    profileImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/0e8e9c273b838de87db00d55e78742145cc305451f92456e37bb97064cdae024",
    ambiance: "Study-friendly",
    pricing: "Affordable",
    wifi: "Fast",
    outlets: "Plenty",
    seating: "Spacious",
    review: "Hands down the best place for studying near DLSU! The ambiance is quiet, the Wi-Fi is stable, and they have plenty of charging outlets. Their caramel macchiato is a must-try! The staff is friendly, and they even offer student discounts. Highly recommended for late-night study sessions!",
    images: [
      "https://cdn.builder.io/api/v1/image/assets/TEMP/45a9cf20df33b1a9facfd1c8ef16f4db2df9ac647ca5182ecc3fe346e120ed9a",
      "https://cdn.builder.io/api/v1/image/assets/TEMP/c66159d4e4e5fbd1a1e0dfd3cceaa899c817e92fb2c4bcedb413d7726acf714c",
      "https://cdn.builder.io/api/v1/image/assets/TEMP/77178b872a1152237eef179262e6fb551321dad3a6720615ded7ab01fdd3a64d"
    ]
  },
  {
    name: "Chrystel Marcelo",
    date: "2024-10-09",
    rating: 3.0,
    profileImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/301c68b014a792adb4daacf1de3fdd4bb5b1f2261087c53292c171b7670f45a1",
    ambiance: "Loud",
    pricing: "Affordable",
    wifi: "Slow",
    outlets: "Limited",
    seating: "Spacious",
    review: "Their iced mocha was amazing, and the prices were reasonable! However, the café was too noisy, making it difficult to concentrate on studying. The seating was also a bit cramped. It's a great place to hang out with friends, but if you need a quiet place to work, this might not be the best option."
  }
];

const galleryImages = [
  "https://cdn.builder.io/api/v1/image/assets/TEMP/d33c8b996690cde7a55234f94960722c5a325d148f7a0ae8ee1cb1a3c7d74f48",
  "https://cdn.builder.io/api/v1/image/assets/TEMP/07af117bd12534e04683c09aca5c0bca22197c67964b4df05d83dba8bbeb4eec",
  "https://cdn.builder.io/api/v1/image/assets/TEMP/7e8909f772dd6c7416b9e681b08a6437625117702bd5867ba07db0eb108e5b5e",
  "https://cdn.builder.io/api/v1/image/assets/TEMP/d5bbf85ef003b7aca3e8326669d807d807a3766e70da4d7c7793c45aaac0efe7",
  "https://cdn.builder.io/api/v1/image/assets/TEMP/d5bbf85ef003b7aca3e8326669d807d807a3766e70da4d7c7793c45aaac0efe7"
];

export default function CBTL() {
  return (
    <div className={styles.cafeDetailsPage}>
      <CafeDetails />
      <ImageGallery images={galleryImages} />
      <ReviewsSection reviews={reviews} />
    </div>
  );
}