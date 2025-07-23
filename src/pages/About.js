import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function About() {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  const team = [
    {
      name: 'Vrisag Desinani',
      role: 'Lead Developer',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      desc: 'Expert in full-stack development, system architecture, and AI integration.'
    },
    {
      name: 'Srujan Chilakapati',
      role: 'UI/UX Designer',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      desc: 'Passionate about user-centered design, smooth animations, and visual polish.'
    },
    {
      name: 'Srikar Chilakapati',
      role: 'Product Manager',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      desc: 'Brings vision, clarity, and team alignment to every feature we build.'
    },
    {
      name: 'Shankar Subramanian',
      role: 'Security Engineer',
      image: 'https://randomuser.me/api/portraits/men/76.jpg',
      desc: 'Focuses on protecting user data and ensuring platform resilience.'
    },
  ];

  return (
    <div className="about-container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h1
        data-aos="fade-down"
        data-aos-duration="1000"
        style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '2rem',
          color: '#fff',
          textShadow: '0 0 10px rgba(255,255,255,0.2)'
        }}
      >
        Meet the Team
      </h1>

      <p
        data-aos="fade-up"
        data-aos-delay="100"
        data-aos-duration="1000"
        style={{
          maxWidth: '700px',
          margin: '0 auto 3rem',
          fontSize: '1.2rem',
          color: '#ccc',
        }}
      >
        We're a passionate team of developers, designers, and engineers working to make AI smarter and more secure.
      </p>

      <div
        className="team-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {team.map((person, index) => (
          <div
            key={index}
            className="team-card"
            data-aos="fade-up"
            data-aos-delay={index * 200}
            data-aos-duration="1000"
            style={{
              backgroundColor: '#1a1a1a',
              borderRadius: '1rem',
              padding: '2rem',
              color: '#fff',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              transition: 'transform 0.3s ease',
            }}
          >
            <img
              src={person.image}
              alt={person.name}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '1rem',
                border: '3px solid #444',
              }}
            />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{person.name}</h2>
            <h3 style={{ fontSize: '1rem', color: '#a7a7a7', marginBottom: '1rem' }}>{person.role}</h3>
            <p style={{ fontSize: '0.95rem', color: '#ccc' }}>{person.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
