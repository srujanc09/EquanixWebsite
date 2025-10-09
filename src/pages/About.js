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
      name: 'Anish Talla',
      role: 'UI/UX Developer',
      image: 'https://randomuser.me/api/portraits/men/68.jpg',
      desc: 'Designs intuitive interfaces and prototypes, focusing on accessibility and delightful user journeys.'
    }
  ];

  return (
    <div className="about-inner-content" >
      <h1 data-aos="fade-down" data-aos-duration="1000" className="about-title">
        Meet the Team
      </h1>
      <p data-aos="fade-up" data-aos-delay="100" data-aos-duration="1000" className="about-desc">
        We're a passionate team of developers, designers, and engineers working to make AI smarter and more secure.
      </p>
      <div className="team-grid team-grid-centered">
        {team.map((person, index) => (
          <div
            key={index}
            className="team-card"
            data-aos="fade-up"
            data-aos-delay={index * 200}
            data-aos-duration="1000"
          >
            <img
              src={person.image}
              alt={person.name}
              className="team-avatar"
            />
            <h2 className="team-name">{person.name}</h2>
            <h3 className="team-role">{person.role}</h3>
            <p className="team-desc">{person.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
