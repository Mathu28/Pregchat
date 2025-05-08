import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CuteLogo from './assets/pregchat_logo.png';
import PregnantWomanIllustration from './assets/pregnant-woman.png';
import CompanionIcon from './assets/companion-icon.png';
import MedicalDataIcon from './assets/medical-data-icon.png';
import MedicinesIcon from './assets/medicines-icon.png';
import ResourcesIcon from './assets/resources-icon.png';
import EmergencyIcon from './assets/emergency-icon.png';
import TalkToBabyIcon from './assets/talk-to-baby-icon.png'; // Import the new icon

function Landing() {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    const storedUserName = localStorage.getItem('user_name');

    if (storedUserId) {
      setUserId(storedUserId);
      setUserName(storedUserName || storedUserId);
    } else {
      window.location.href = '/';
    }
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const modules = [
    { title: 'Companion', path: '/chat-ui', icon: CompanionIcon },
    { title: 'Medical Data', path: '/medical-data', icon: MedicalDataIcon },
    { title: 'Medicines', path: '/medicines', icon: MedicinesIcon },
    { title: 'Resources', path: '/resources', icon: ResourcesIcon },
    { title: 'Emergency', path: '/emergency', icon: EmergencyIcon },
    { title: 'Talk to Baby', path: '/talk-to-baby', icon: TalkToBabyIcon }, // Added the new module
  ];

  return (
    <div style={styles.page}>
      <div style={styles.contentWrapper}>
        <section style={styles.heroSection}>
          <div style={styles.heroText}>
            <img src={CuteLogo} alt="PregChat Logo" style={styles.logo} />
            <h1 style={styles.heroTitle}>Welcome to PregChat</h1>
            <p style={styles.heroDescription}>
              A safe space to talk, track, and learn during pregnancy. PregChat is your smart assistant offering real-time support, reminders, and personalized advice.
            </p>
          </div>
          <img
            src={PregnantWomanIllustration}
            alt="Pregnant Woman"
            style={styles.heroImage}
          />
        </section>

        <section style={styles.moduleSection}>
          <div style={styles.cardContainer}>
            <h2 style={styles.moduleHeading}>Explore Our Modules</h2>
            <p style={styles.moduleSubheading}>Choose a module to continue your journey:</p>
            <div style={styles.grid}>
              {modules.map((mod, index) => (
                <div
                  key={index}
                  style={styles.card}
                  onClick={() => handleNavigate(mod.path)}
                >
                  <img src={mod.icon} alt={`${mod.title} Icon`} style={styles.cardIcon} />
                  <h3 style={styles.cardTitle}>{mod.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={styles.contactSection}>
          <div style={styles.contactContent}>
            <h2 style={styles.contactHeading}>Contact Us</h2>
            <p style={styles.contactInfo}>
              We're here to support you. Reach out with any questions or feedback.
            </p>
            <address style={styles.contactDetails}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/455/455705.png"
                alt="Telephone Icon"
                style={{
                  width: '20px',
                  height: '20px',
                  marginRight: '8px',
                  verticalAlign: 'middle',
                }}
              />

              Email: support@pregchat.com<br />
              Phone: +91-XXXXXXXXXX<br />
              Address: 123 Comfort Lane, Chennai, TN - 600XXX
            </address>
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: '#ffe6f0', // Very light pink background
    minHeight: '100vh',
    fontFamily: "'Poppins', sans-serif", // A friendly and rounded font
    padding: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflowX: 'hidden',
  },
  contentWrapper: {
    maxWidth: '1200px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '30px',
    padding: '60px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
    backgroundColor: '#fff',
  },
  heroSection: {
    backgroundColor: 'transparent',
    padding: '60px 40px',
    textAlign: 'left',
    marginBottom: '50px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    maxWidth: '150px',
    marginBottom: '30px',
  },
  heroText: {
    maxWidth: '50%',
  },
  heroTitle: {
    fontSize: '3.5rem', // Adjusted font size
    color: '#212121',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  heroDescription: {
    fontSize: '1.2rem', // Adjusted font size
    color: '#757575',
    lineHeight: '1.7',
    marginBottom: '30px',
  },
  heroButtons: {
    display: 'flex',
    gap: '20px',
  },
  heroButton: {
    backgroundColor: '#ff4081',
    color: '#fff',
    padding: '15px 30px',
    borderRadius: '25px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#f50057',
    },
  },
  secondaryButton: {
    backgroundColor: '#fff',
    color: '#ff4081',
    padding: '15px 30px',
    borderRadius: '25px',
    border: '2px solid #ff4081',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    '&:hover': {
      backgroundColor: '#ff4081',
      color: '#fff',
    },
  },
  heroImage: {
    maxWidth: '40%',
    height: 'auto',
  },
  moduleSection: {
    width: '95%',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '70px',
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: '40px',
    padding: '60px 80px',
    boxShadow: '0 15px 45px rgba(0, 0, 0, 0.05)',
    textAlign: 'center',
    maxWidth: '1100px',
    width: '100%',
  },
  moduleHeading: {
    fontSize: '3rem', // Adjusted font size
    color: '#ff6ec4',
    marginBottom: '25px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  moduleSubheading: {
    fontSize: '1.2rem', // Adjusted font size
    color: '#888',
    marginBottom: '50px',
    lineHeight: '1.7',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', // Slightly wider cards
    gap: '30px',
    marginTop: '40px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '25px',
    padding: '30px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.03)',
    textAlign: 'center',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.06)',
    },
  },
  cardIcon: {
    maxWidth: '60px',
    height: 'auto',
    margin: '0 auto 15px',
    display: 'block',
  },
  cardTitle: {
    fontSize: '1.3rem', // Adjusted font size
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#ff4081',
  },
  contactSection: {
    backgroundColor: '#ffe0e5',
    padding: '70px 40px',
    borderRadius: '30px',
    width: '90%',
    marginBottom: '50px',
    boxShadow: '0 10px 30px rgba(255, 224, 229, 0.3)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactContent: {
    maxWidth: '50%',
    textAlign: 'left',
  },
  contactHeading: {
    fontSize: '2.5rem', // Adjusted font size
    color: '#c2185b',
    marginBottom: '25px',
    fontWeight: 'bold',
  },
  contactInfo: {
    fontSize: '1.1rem', // Adjusted font size
    color: '#666',
    marginBottom: '20px',
  },
  contactDetails: {
    fontSize: '1rem', // Adjusted font size
    color: '#777',
    lineHeight: '1.8',
    display: 'flex', // Align icon and text
    alignItems: 'center',
    gap: '10px', // Space between icon and text
  },
  contactIcon: {
    maxWidth: '24px', // Adjust size as needed
    height: 'auto',
  },
  contactImage: {
    maxWidth: '40%',
    height: 'auto',
    // Removed contact image
  },
};
export default Landing;