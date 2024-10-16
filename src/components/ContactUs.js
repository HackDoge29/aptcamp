// src/components/ContactUs.js
import React from 'react';

const ContactUs = () => {
  return (
    <div id="contact" className="bg-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center">Contact Us</h2>
        <form className="mt-10 max-w-lg mx-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium">Name</label>
            <input type="text" className="w-full mt-1 px-4 py-2 bg-gray-800 rounded-lg" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input type="email" className="w-full mt-1 px-4 py-2 bg-gray-800 rounded-lg" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Message</label>
            <textarea className="w-full mt-1 px-4 py-2 bg-gray-800 rounded-lg" rows="4"></textarea>
          </div>
          <button className="w-full py-3 bg-indigo-600 rounded-lg">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
