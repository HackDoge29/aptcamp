// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <p>&copy; 2024 AptCamp. All rights reserved.</p>
          <nav>
            <a href="#about" className="ml-4">About</a>
            <a href="#features" className="ml-4">Features</a>
            <a href="#guides" className="ml-4">Guides</a>
            <a href="#contact" className="ml-4">Contact Us</a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



