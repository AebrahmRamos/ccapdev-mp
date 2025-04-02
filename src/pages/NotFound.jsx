import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="not-found-container"
      style={{ textAlign: 'center', padding: '4rem 1rem' }}
    >
      <h1>404 - Page Not Found</h1>
      <p>The coffee you&apos;re looking for might have spilled!</p>
      <Link to="/" style={{ display: 'inline-block', marginTop: '1rem' }}>
        Return to Homepage
      </Link>
    </motion.div>
  );
};

export default NotFound;