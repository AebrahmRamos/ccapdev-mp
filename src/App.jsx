import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CafeSection from './components/CafeSection';
import './App.css';

const trendingCafes = [
  {
    image: '/images/cafe1.jpg',
    title: 'Coffee Project Black',
  },
  {
    image: '/images/cafe2.jpg',
    title: 'Starbucks Reserve',
  },
  {
    image: '/images/cafe3.jpg',
    title: 'The Coffee Academics',
  },
];

const studyCafes = [
  {
    image: '/images/study1.jpg',
    title: 'Bo\'s Coffee',
  },
  {
    image: '/images/study2.jpg',
    title: 'Seattle\'s Best',
  },
  {
    image: '/images/study3.jpg',
    title: 'CBTL',
  },
];

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={
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
          } />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
