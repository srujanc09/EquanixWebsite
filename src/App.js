import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import HeroScrollDemo from './HeroScrollDemo';
import Features from './pages/Features';
import Docs from './pages/Docs';
import About from './pages/About';
import Resources from './pages/Resources';
import './style.css';

function Navbar() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <header
      className="container"
      style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <h1
        data-aos="fade-down"
        className="logo"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        Self Healing AI
      </h1>

      <nav style={{ display: 'flex', gap: '2rem' }}>
        {/* Removed HOME link */}
        <Link to="/about">ABOUT US</Link>
        <Link to="/features">FEATURES</Link>
        <Link to="/resources">RESOURCES</Link>
        <Link to="/docs">PRICING</Link>
      </nav>

      <button
        onClick={() => navigate('/features')}
        className="btn-signing"
      >
        Self Healing
      </button>
    </header>
  );
}

function Home() {
  return (
    <main>
      <div className="content">
        <div className="tag-box">
          <div className="tag">Self Healing AI</div>
        </div>
        <h1>EMAIL FOR <br /> SIGNUPS</h1>
        <p className="description">Fix your code with security and efficiency!</p>
        <div className="buttons">
          <Link to="/docs" className="btn-get-started">Documentation &gt;</Link>
          <Link to="/features" className="btn-signing-main">Get Started &gt;</Link>
        </div>
      </div>
      <div style={{
        marginTop: '3rem',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <HeroScrollDemo />
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/resources" element={<Resources />} />
      </Routes>
    </Router>
  );
}
