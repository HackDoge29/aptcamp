// src/components/Features.js
import React from 'react';
import { FeaturesGraphic } from './SVG';

const features = [
  { title: "Exclusive Content", description: "Fans can access exclusive images, music, videos, tickets, and more by joining different membership tiers of their favorite content creator." },
  { title: "Fan Data Insights", description: "Get tailored offers and interactions based on your engagement." },
  { title: "Tokenized Memberships", description: "Own NFTs representing your fan club memberships." },
  { title: "Direct Artist-Fan Engagement", description: "Artists can directly interact with their fans without intermediaries." }
];

const Features = () => {
  return (
    <div id="features" className="bg-gray-800 text-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center">Features</h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              <FeaturesGraphic />
              <h3 className="text-xl font-bold mt-4">{feature.title}</h3>
              <p className="mt-2 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
