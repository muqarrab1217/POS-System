// Import React
import React from 'react';

// Define Footer component
const Footer = () => {
  return (
    <footer style={footerStyle}>
      <p>&copy; {new Date().getFullYear()} Restaurant POS System</p>
    </footer>
  );
};

// Optional: Styling for the footer
const footerStyle = {
  backgroundColor: '#333',
  color: 'white',
  textAlign: 'center',
  padding: '10px 0',
  position: '',
  left: 0,
  bottom: 0,
  width: '100%',
};

// Export the Footer component
export default Footer;
