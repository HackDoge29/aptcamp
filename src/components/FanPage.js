import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';


// const CHAIN = Testnet(2);

const FanPage = ({ signer }) => {
  const [artists, setArtists] = useState([]);
  const [selectedTier, setSelectedTier] = useState('');
  const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
  const [userAddress, setUserAddress] = useState('');

  useEffect(() => {
    const getUserAddress = async () => {
      try {
        const accounts = await signer.getAccounts();
        const accountAddress = accounts[0].address;
        setUserAddress(accountAddress);
      } catch (error) {
        console.error('Error getting user address:', error);
        toast.error('Please connect your wallet');
      }
    };

    getUserAddress();
  }, [signer]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'nibiartists'));
        const artistsList = querySnapshot.docs.map(doc => ({
          docId: doc.id, // Document ID in Firestore
          ...doc.data()
        }));
        setArtists(artistsList);
      } catch (error) {
        console.error('Error fetching artists:', error);
        toast.error('Failed to fetch artists');
      }
    };

    fetchArtists();
  }, []);

  const subscribe = async (artistDocId, tierName) => {
    try {
      if (!signer) {
        toast.error('Provider not available. Please connect your wallet.');
        return;
      }

      const accounts = await signer.getAccounts();
      const accountAddress = accounts[0].address;

      if (!accountAddress) {
        toast.error('Please sign in to subscribe');
        return;
      }

      const artistDocRef = doc(db, 'nibiartists', artistDocId);
      const artistDoc = await getDoc(artistDocRef);

      if (!artistDoc.exists()) {
        toast.error('Selected artist does not exist');
        return;
      }

      const artistData = artistDoc.data();
      const selectedTier = artistData.tiers.find(t => t.name === tierName);

      if (!selectedTier) {
        toast.error('Selected tier does not exist');
        return;
      }

      const artistAddress = artistData.address;
      const artistName = artistData.name;

      const confirmation = window.confirm(`Pay ${selectedTier.price} $APT to subscribe to ${artistName} ${tierName} tier?`);

      if (!confirmation) {
        toast.info('Payment cancelled');
        return;
      }


      const recipient = artistAddress;
      const initialAmount = selectedTier.price;
      // const finalAmount = coin(initialAmount.toString(), "unibi");



      toast.success('Payment successful!');

      const updatedSubscribers = [
        ...(artistData.subscribers || []),
        { address: userAddress, tier: tierName }
      ];

      await updateDoc(artistDocRef, { subscribers: updatedSubscribers });

      toast.success('Subscription successful!');
    } catch (error) {
      console.error('Error during transaction:', error);
      toast.error('Subscription failed.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">Content Creators</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map((artist) => (
          <div key={artist.docId} className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-bold">{artist.name}</h2>
              <span className="ml-2 text-yellow-500">&#10004;</span> {/* Gold checkmark */}
            </div>
            <img src={artist.avatar} alt={artist.name} className="w-32 h-32 rounded-full mb-4" />
            <p className="mb-4">{artist.genre}</p>
            {artist.tiers && artist.tiers.map((tier) => (
              <div key={tier.name} className="mb-4">
                <h3 className="text-lg font-bold">{tier.name}</h3>
                <p>{tier.price} $APT</p>
                <p>{tier.benefits}</p>
              </div>
            ))}
            <select
              className="block w-full mb-4 px-4 py-2 bg-gray-700 rounded-lg"
              onChange={(e) => setSelectedTier(e.target.value)}
            >
              <option value="">Select Tier</option>
              {tiers.map((tier) => (
                <option key={tier} value={tier}>{tier}</option>
              ))}
            </select>
            <button
              className="mt-4 px-4 py-2 bg-indigo-600 rounded-lg text-white"
              onClick={() => subscribe(artist.docId, selectedTier)}
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FanPage;
