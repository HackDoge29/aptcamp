import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';

import { db } from './firebaseConfig';


const ManageSubscribers = ({ signer }) => {
  const [artists, setArtists] = useState([]);
  const [fans, setFans] = useState([]);
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
    const fetchArtistData = async () => {
      if (userAddress) {
        try {
          const q = query(collection(db, 'nibiartists'), where('address', '==', userAddress));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            toast.error('You are not an artist. Please create content first.');
            return;
          }

          const artistList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log('Artist List:', artistList);
          setArtists(artistList);

          // Combine all fans from all artist accounts
          const allFans = artistList.flatMap(artist =>
            (artist.subscribers || []).map(subscriber => ({
              ...subscriber,
              artistId: artist.id,
              artistName: artist.name
            }))
          );

          console.log('All Fans:', allFans);
          setFans(allFans);


          if (allFans.length === 0) {
            toast.error('You have no subscribers yet.');
            return;
          }

        } catch (error) {
          console.error('Error fetching artist data:', error);
          toast.error('Failed to fetch artist data');
        }
      }
    };

    fetchArtistData();
  }, [userAddress]);




  const revokeSubscription = async (fanAddress, artistId) => {
    try {

      const artistDocRef = doc(db, 'nibiartists', artistId);
      const artistDoc = await getDoc(artistDocRef);

      if (artistDoc.exists()) {
        const artistData = artistDoc.data();
        const updatedSubscribers = (artistData.subscribers || []).filter(fan => fan.address !== fanAddress);

        await updateDoc(artistDocRef, { subscribers: updatedSubscribers });
        setFans(prevFans => prevFans.filter(fan => !(fan.address === fanAddress && fan.artistId === artistId)));
        toast.success('Subscription revoked successfully');
      } else {
        console.error('Artist document does not exist');
        toast.error('Artist document does not exist');
      }
    } catch (error) {
      console.error('Error revoking subscription:', error);
      toast.error('Failed to revoke subscription');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Active Subscribers</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fans.map((fan, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg w-64 h-64 overflow-hidden">
              <div className="flex flex-col items-center">
                 {fan.address}
                <p className="mb-4">{fan.tier} - {fan.artistName}</p>
              </div>
              <button
                className="mt-4 px-4 py-2 bg-red-600 rounded-lg text-white"
                onClick={() => revokeSubscription(fan.address, fan.artistId)}
              >
                Revoke Subscription
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageSubscribers;
