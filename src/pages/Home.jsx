import Hero from "../components/HeroSection";
import PopularCafes from "../components/PopularCafes";
import { motion } from "framer-motion";

const NewPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <>
        <Hero />
        <PopularCafes />
      </>
    </motion.div>
  );
};

export default NewPage;
