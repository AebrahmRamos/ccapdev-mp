import Hero from "../components/Hero";
import CafeSection from "../components/CafeSection";

const trendingCafes = [
  {
    image: "src/images/cafe1.jpg",
    title: "Elsewhere Café",
  },
  {
    image: "src/images/cafe2.jpg",
    title: "Starbucks Reserve",
  },
  {
    image: "src/images/cafe3.jpg",
    title: "The Coffee Academics",
  },
];

const studyCafes = [
  {
    image: "src/images/cafe4.jpg",
    title: "Bo's Coffee",
  },
  {
    image: "src/images/cafe5.jpg",
    title: "Seattle's Best",
  },
  {
    image: "src/images/cafe6.jpg",
    title: "CBTL",
  },
];

const Home = () => {
  return (
    <>
      <Hero />
      <CafeSection
        title="TRENDING CAFES"
        subtitle="Explore the most popular cafés near DLSU"
        cafes={trendingCafes}
      />
      <CafeSection
        title="BEST FOR STUDYING"
        subtitle="Explore top-rated study-friendly cafés"
        cafes={studyCafes}
      />
    </>
  );
};

export default Home;
