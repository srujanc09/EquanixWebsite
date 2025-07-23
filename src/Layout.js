import { Outlet, Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

export default function Layout() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
        background: 'linear-gradient(120deg, #111 0%, #222 25%, #444 50%, #222 75%, #111 100%)',
        backgroundSize: '200% 200%',
        animation: 'glideGradient 12s ease-in-out infinite',
        color: '#e7e7e7',
        overflowX: 'hidden',
      }}
    >
      {/* Background effects */}
      <img className="image-gradient" src="/gradient.png" alt="gradient" style={{ opacity: 0, zIndex: -1, position: 'absolute', top: 0, right: 0 }} />
      <div
        className="layer-blur"
        style={{
          height: 0,
          width: '30rem',
          position: 'absolute',
          top: '20%',
          right: 0,
          boxShadow: '0 0 700px 15px white',
          rotate: '-30deg',
          zIndex: -1,
        }}
      />

      {/* Container for header and content */}
      <div className="container" style={{ width: '100%', padding: '0 2rem', position: 'relative', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 5rem' }}>
          <h1 data-aos="fade-down" data-aos-duration="1500" className="logo" style={{ fontSize: '3rem', fontWeight: 300 }}>
            Self Healing AI
          </h1>
          <nav style={{ display: 'flex', gap: '2rem' }}>
            <Link data-aos="fade-down" data-aos-duration="1500" to="/about">ABOUT US</Link>
            <Link data-aos="fade-down" data-aos-duration="2000" to="/features">FEATURES</Link>
            <Link data-aos="fade-down" data-aos-duration="2500" to="/resources">RESOURCES</Link>
            <Link data-aos="fade-down" data-aos-duration="3000" to="/docs">DOCS</Link>
            <Link data-aos="fade-down" data-aos-duration="3000" to="/">HOME</Link>
          </nav>
          <button
            data-aos="fade-down"
            data-aos-duration="1500"
            className="btn-signing"
            style={{
              backgroundColor: '#a7a7a7',
              color: 'black',
              padding: '0.8rem 1.5rem',
              borderRadius: '50px',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/features')}
          >
            Self Healing
          </button>
        </header>
      </div>

      {/* This is where each page is rendered */}
      <Outlet />
    </div>
  );
}
