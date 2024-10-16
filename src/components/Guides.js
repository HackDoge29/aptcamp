// src/components/Guides.js
import React from 'react';

const guides = [
  { title: "How to Join", description: "Fans connect their wallet to Aptos Network to access the AptCamp platform." },
  { title: "Browse Artists", description: "Users can browse a list of content creators and view their available membership tiers and benefits." },
  { title: "Join Communities", description: "Fans select a membership tier and join an artist's community through a secure blockchain transaction." },
  { title: "Access Exclusive Contents", description: "After joining, fans can access the exclusive content provided by the artists based on their membership tier." }
];

const Guides = () => {
  return (
    <div id="guides" className="bg-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center">Guides</h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {guides.map((guide, index) => (
            <div key={index} className="flex flex-col items-center">
              <h3 className="text-xl font-bold mt-4">{guide.title}</h3>
              <p className="mt-2 text-center">{guide.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Guides;
