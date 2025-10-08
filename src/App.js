import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HeroScrollDemo from './HeroScrollDemo';
import Features from './pages/Features';
import Docs from './pages/Docs';
import About from './pages/About';
import Resources from './pages/Resources';
import Dashboard from './pages/Dashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthModal from './components/AuthModal';
import UserMenu from './components/UserMenu';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRequiredPage from './components/AuthRequiredPage';
import './style.css';
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react";
import ExpandableChatDemo from "./components/ExpandableChatDemo";
import CandlestickChart from "./components/CandlestickChart";

// Features Section Component
function FeaturesSection() {
  const features = [
    {
      title: "AI Strategy Development",
      description: "Create sophisticated trading strategies with natural language, no coding required.",
      icon: <IconTerminal2 className="h-6 w-6" />,
    },
    {
      title: "Advanced Backtesting",
      description: "Test strategies against historical data with sophisticated risk metrics and analysis.",
      icon: <IconEaseInOut className="h-6 w-6" />,
    },
    {
      title: "Real-time Analysis",
      description: "Get instant market insights and trading signals powered by advanced AI algorithms.",
      icon: <IconAdjustmentsBolt className="h-6 w-6" />,
    },
    {
      title: "Multi-Asset Support",
      description: "Trade stocks, crypto, forex, and other markets from a single platform.",
      icon: <IconCloud className="h-6 w-6" />,
    },
    {
      title: "Risk Management",
      description: "AI-powered position sizing and risk analytics to protect your portfolio.",
      icon: <IconRouteAltLeft className="h-6 w-6" />,
    },
    {
      title: "24/7 AI Monitoring",
      description: "Continuous market surveillance and alert system for trading opportunities.",
      icon: <IconHelp className="h-6 w-6" />,
    },
    {
      title: "Portfolio Optimization",
      description: "Machine learning algorithms for optimal asset allocation and rebalancing.",
      icon: <IconCurrencyDollar className="h-6 w-6" />,
    },
    {
      title: "Strategy Evolution",
      description: "Self-improving AI that adapts to changing market conditions.",
      icon: <IconHeart className="h-6 w-6" />,
    },
  ];

  return (
    <section className="w-full py-16 features-gradient-bg mt-60"> {/* Further increased margin-top to ensure separation */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-white">
            AI Trading Platform
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
            Advanced artificial intelligence for sophisticated trading strategies
          </p>
        </div>
        
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col lg:border-r py-10 relative group/feature border-gray-500 ${
                (index === 0 || index === 4) && "lg:border-l"
              } ${
                index < 4 && "lg:border-b"
              }`}
              data-aos="fade-up"
              data-aos-delay={(index % 4) * 100 + 200}
            >
              {index < 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-gray-700/20 to-transparent pointer-events-none" />
              )}
              {index >= 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-gray-700/20 to-transparent pointer-events-none" />
              )}
              <div className="mb-4 relative z-10 px-10 text-gray-300">
                {feature.icon}
              </div>
              <div className="text-lg font-bold mb-2 relative z-10 px-10">
                <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-gray-500 group-hover/feature:bg-white transition-all duration-200 origin-center" />
                <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-white">
                  {feature.title}
                </span>
              </div>
              <p className="text-sm text-gray-300 max-w-xs relative z-10 px-10">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Logo Carousel Component
function LogoCarousel() {
  const logos = [
    {
      id: "logo-1",
      description: "Astro",
      image: "https://www.shadcnblocks.com/images/block/logos/astro.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-2",
      description: "Figma",
      image: "https://www.shadcnblocks.com/images/block/logos/figma.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-3",
      description: "Next.js",
      image: "https://www.shadcnblocks.com/images/block/logos/nextjs.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-4",
      description: "React",
      image: "https://www.shadcnblocks.com/images/block/logos/react.png",
      className: "h-7 w-auto",
    },
    {
      id: "logo-5",
      description: "shadcn/ui",
      image: "https://www.shadcnblocks.com/images/block/logos/shadcn-ui.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-6",
      description: "Supabase",
      image: "https://www.shadcnblocks.com/images/block/logos/supabase.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-7",
      description: "Tailwind CSS",
      image: "https://www.shadcnblocks.com/images/block/logos/tailwind.svg",
      className: "h-4 w-auto",
    },
    {
      id: "logo-8",
      description: "Vercel",
      image: "https://www.shadcnblocks.com/images/block/logos/vercel.svg",
      className: "h-7 w-auto",
    },
  ];

  return (
    <section className="logo-carousel">
      <div className="container flex flex-col items-center text-center">
        <h1 className="my-6 text-2xl font-bold text-pretty lg:text-4xl text-white">
          Trusted by these companies
        </h1>
      </div>
      <div className="pt-10 md:pt-16 lg:pt-20">
        <div className="relative mx-auto flex items-center justify-center lg:max-w-5xl">
          <div className="w-full overflow-hidden">
            <div className="flex animate-[scroll_20s_linear_infinite]">
              {logos.map((logo) => (
                <div
                  key={logo.id}
                  className="mx-10 flex min-w-0 shrink-0 grow-0 basis-1/3 justify-center sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
                >
                  <div className="flex shrink-0 items-center justify-center">
                    <img
                      src={logo.image}
                      alt={logo.description}
                      className={logo.className}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-gray-800 to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-gray-800 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}

// Navbar Component
function NavbarWrapper() {
  const location = useLocation();
  // hide navbar on dashboard and any nested dashboard routes
  if (location && location.pathname && location.pathname.startsWith('/dashboard')) {
    return null;
  }
  return <Navbar />;
}

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.navbar-container');
      if (window.scrollY > 100) {
        header.classList.add('navbar-scrolled');
      } else {
        header.classList.remove('navbar-scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="navbar-container">
        <div className="navbar-content container">
          <h1
            data-aos="fade-down"
            data-aos-delay="0"
            className="logo"
            onClick={() => navigate('/')}
          >
            Equanix
          </h1>

          <nav className="navbar-links">
            <Link to="/about" data-aos="fade-down" data-aos-delay="200">ABOUT US</Link>
            <Link to="/features" data-aos="fade-down" data-aos-delay="400">FEATURES</Link>
            <Link to="/resources" data-aos="fade-down" data-aos-delay="600">RESOURCES</Link>
            <Link to="/docs" data-aos="fade-down" data-aos-delay="800">DOCUMENTATION</Link>
          </nav>

          <div className="navbar-auth">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <button 
                className="btn-login"
                onClick={() => setShowAuthModal(true)}
                data-aos="fade-down" 
                data-aos-delay="1000"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </>
  );
}

// Dashboard Button Component
function DashboardButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // hide the fixed dashboard button when on dashboard or auth-required pages
  if (location && location.pathname) {
    const p = location.pathname;
    if (p.startsWith('/dashboard')) {
      return null;
    }
  }

  const handleDashboardClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleDashboardClick}
        className="btn-dashboard-fixed"
        data-aos="fade-down"
        data-aos-delay="1000"
      >
        {isAuthenticated ? 'Dashboard' : 'Get Started'}
      </button>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signup"
      />
    </>
  );
}

// Home Component
function Home() {
  useEffect(() => {
    AOS.refresh();
  }, []);

  return (
    <main className="main-content-wrapper">
      <div className="content" style={{ marginTop: '3.5rem', marginLeft: '50px' }}>
        <div className="tag-box" data-aos="fade-up" data-aos-delay="100">
          <div className="tag" data-aos="fade-up" data-aos-delay="200">Equanix</div>
        </div>
        <h1 data-aos="fade-up" data-aos-delay="300">
          Making Quant <br /> Trading Simpler
        </h1>
        <p className="description" data-aos="fade-up" data-aos-delay="400">
          Develop, test, and optimize your trading strategies with advanced AI - no coding required
        </p>
        <div className="sub-description" data-aos="fade-up" data-aos-delay="450">
          <p>Our AI platform specializes in:</p>
          <ul>
            <li>• Converting your trading ideas into testable strategies</li>
            <li>• Advanced backtesting with historical market data</li>
            <li>• Strategy optimization using ML & RL algorithms</li>
            <li>• Comprehensive performance analytics and risk metrics</li>
            <li>• Discovering new trading patterns and opportunities</li>
          </ul>
        </div>
        <div className="buttons" data-aos="fade-up" data-aos-delay="500">
          <Link to="/dashboard" className="btn-get-started">Launch Dashboard &gt;</Link>
          <Link to="/features" className="btn-signing-main">Learn More &gt;</Link>
        </div>
      </div>
      <div className="mt-0 mb-0">
        <FeaturesSection />
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '3rem', marginTop: '1.5rem', justifyContent: 'center', marginLeft: '-320px' }}>
        <div style={{ flex: 'none', width: 'auto' }}>
          <div
            style={{
              marginTop: '3rem',
              display: 'flex',
              justifyContent: 'center'
            }}
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <HeroScrollDemo />
          </div>
        </div>

        {/* Right side chart area - positioned to align with text (narrower and nudged right) */}
        <div style={{ flex: '0 0 830px', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', position: 'absolute', top: '200px', right: '24px', zIndex: 10 }}>
          <div className="chart-card" 
            style={{ width: 830, transform: 'translate(-10px, -30px)' }}
            data-aos="fade-in"
            data-aos-delay="400"
            data-aos-duration="800"
          >
            <CandlestickChart width={830} height={520} />
          </div>
        </div>
      </div>
      <div className="mt-0 mb-0 relative z-20">
        <ExpandableChatDemo />
      </div>
      <div className="mt-0">
        <LogoCarousel />
      </div>
    </main>
  );
}

// Main App Component
export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <NavbarWrapper />
        <DashboardButton />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<div className="main-content-wrapper"><About /></div>} />
          <Route path="/features" element={<div className="main-content-wrapper"><Features /></div>} />
          <Route path="/docs" element={<div className="main-content-wrapper"><Docs /></div>} />
          <Route path="/resources" element={<div className="main-content-wrapper"><Resources /></div>} />
          <Route path="/dashboard" element={
            <ProtectedRoute fallback={<AuthRequiredPage />}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/*" element={
            <ProtectedRoute fallback={<AuthRequiredPage />}>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
