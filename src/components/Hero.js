// src/components/Hero.js
import React from 'react';
import { motion } from 'framer-motion';
import { HeroGraphic } from './SVG';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <HeroGraphic />
      </motion.div>
      <h1 className="text-5xl font-bold mt-6">Welcome to AptCamp</h1>
      <p className="mt-4 text-lg">AptCamp is a decentralized social platform where content creators can offer exclusive contents and tiered memberships on the blockchain.</p>
      <div className="flex space-x-4 mt-6">
        <Link to="/dapp" className="px-6 py-3 bg-indigo-600 rounded-lg text-lg">Launch Dapp</Link>
      </div>
    </div>
  );
};

export default Hero;
