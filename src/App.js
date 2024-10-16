import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ConnectWalletButton from './components/ConnectWalletButton';
import { Bars3Icon } from '@heroicons/react/24/outline';
import FanPage from './components/FanPage';
import ActiveSubscriptions from './components/ActiveSubscriptions';
import CreateArtistProfile from './components/CreateArtistProfile';
import CreateContent from './components/CreateContent';
import ManageSubscribers from './components/ManageSubscribers';
import Hero from './components/Hero';
import Features from './components/Features';
import Guides from './components/Guides';
import About from './components/About';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
 


const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <Guides />
      <About />
      <ContactUs />
      <div className="text-center mt-8"></div>
    </>
  );
};

const DApp = ({ signer, setSigner }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [artistsDropdownOpen, setArtistsDropdownOpen] = useState(false);
  const [fansDropdownOpen, setFansDropdownOpen] = useState(false);

  const toggleDropdown = (dropdown, event) => {
    event.preventDefault();
    if (dropdown === 'artists') {
      setArtistsDropdownOpen(!artistsDropdownOpen);
      setFansDropdownOpen(false);
    } else if (dropdown === 'fans') {
      setFansDropdownOpen(!fansDropdownOpen);
      setArtistsDropdownOpen(false);
    }
  };

  return (
    <div>
      <header className="bg-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">APT CAMP</Link>
          <nav className="hidden md:flex items-center">
            <Link to="/dapp" className="ml-4">Home</Link>
            <div className="relative ml-4">
              <button
                className="flex items-center"
                onClick={(event) => toggleDropdown('artists', event)}
              >
                Creators
              </button>
              {artistsDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg">
                  <Link to="/dapp/artists/create" className="block px-4 py-2">Create Profile</Link>
                  <Link to="/dapp/artists/content" className="block px-4 py-2">Create Content</Link>
                  <Link to="/dapp/artists/manage" className="block px-4 py-2">Manage Subscribers</Link>
                </div>
              )}
            </div>
            <div className="relative ml-4">
              <button
                className="flex items-center"
                onClick={(event) => toggleDropdown('fans', event)}
              >
                Fans
              </button>
              {fansDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg">
                  <Link to="/dapp/fans/subscriptions" className="block px-4 py-2">Active Subscriptions</Link>
                </div>
              )}
            </div>
          </nav>
          <div className="flex items-center">
            <ConnectWalletButton setSigner={setSigner} />
            <button
              className="md:hidden text-white ml-4"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
        {isOpen && (
          <nav className="md:hidden">
            <Link to="/" className="block px-4 py-2">Home</Link>
            <div className="block px-4 py-2" onClick={(event) => toggleDropdown('artists', event)}>Artists</div>
            {artistsDropdownOpen && (
              <div className="pl-4">
                <Link to="/dapp/artists/create" className="block px-4 py-2">Create Profile</Link>
                <Link to="/dapp/artists/content" className="block px-4 py-2">Create Content</Link>
                <Link to="/dapp/artists/manage" className="block px-4 py-2">Manage Subscribers</Link>
              </div>
            )}
            <div className="block px-4 py-2" onClick={(event) => toggleDropdown('fans', event)}>Fans</div>
            {fansDropdownOpen && (
              <div className="pl-4">
                <Link to="/dapp/fans/subscriptions" className="block px-4 py-2">Active Subscriptions</Link>
              </div>
            )}
          </nav>
        )}
      </header>
      <div className="mt-8">
        <Routes>
          <Route path="/artists/create" element={<CreateArtistProfile signer={signer} />} />
          <Route path="/artists/content" element={<CreateContent signer={signer} />} />
          <Route path="/artists/manage" element={<ManageSubscribers signer={signer} />} />
          <Route path="/fans/subscriptions" element={<ActiveSubscriptions signer={signer} />} />
          <Route path="*" element={<FanPage signer={signer} />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  const [signer, setSigner] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
          <Router>
            <div className="bg-gray-900 text-white min-h-screen">
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <header className="bg-gray-800 py-4">
                        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                          <Link to="/" className="text-2xl font-bold">FanCamp</Link>
                          <nav className="hidden md:flex items-center">
                            <a href="#features" className="ml-4">Features</a>
                            <a href="#guides" className="ml-4">Guides</a>
                            <a href="#about" className="ml-4">About Us</a>
                            <a href="#contact" className="ml-4">Contact Us</a>
                          </nav>
                          <div className="flex items-center">
                            <Link to="/dapp" className="px-3 py-2 bg-indigo-600 rounded-lg text-white text-lg md:px-4 md:py-2">
                              Launch DApp
                            </Link>
                            <button
                              className="md:hidden text-white ml-4"
                              onClick={() => setIsOpen(!isOpen)}
                            >
                              <Bars3Icon className="h-6 w-6" />
                            </button>
                          </div>
                        </div>
                        {isOpen && (
                          <nav className="md:hidden">
                            <a href="#features" className="block px-4 py-2">Features</a>
                            <a href="#guides" className="block px-4 py-2">Guides</a>
                            <a href="#about" className="block px-4 py-2">About Us</a>
                            <a href="#contact" className="block px-4 py-2">Contact Us</a>
                          </nav>
                        )}
                      </header>
                      <Home />
                      <Footer />
                    </>
                  }
                />
                <Route
                  path="/dapp/*"
                  element={<DApp signer={signer} setSigner={setSigner} />}
                />
                <Route path="*" element={<Home />} />
              </Routes>
            </div>
          </Router>
  );
};

export default App;
