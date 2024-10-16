import React, { useRef, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';



const CreateArtistProfile = ( {signer} ) => {
  const nameRef = useRef();
  const genreRef = useRef();
  const avatarRef = useRef();
  const addressRef = useRef();
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

  const generateUniqueId = async () => {
    const querySnapshot = await getDocs(collection(db, 'nibiartists'));
    const artistIds = querySnapshot.docs.map(doc => doc.data().id);
    let newId = 1;
    while (artistIds.includes(newId)) {
      newId += 1;
    }
    return newId;
  };

 

  const createArtist = async (name, genre, avatar, address) => {
    try {

      if (!name || !genre || !avatar || !address ) {
        toast.error('Please fill in all fields');
        return;
      }
      toast.info('Saving creator profile...');
     

      const artistId = await generateUniqueId();

      const artistData = {
        id: artistId,
        name,
        genre,
        address,
        avatar,
        tiers: [],
      };

      await addDoc(collection(db, 'nibiartists'), artistData);

      toast.success('Creator profile created successfully!');
      window.location.href = '/dapp/artists/content';
    } catch (error) {
      console.error('Error creating artist:', error);
      if (error.message === 'provider not available') {
        toast.error('provider not available. Please ensure your wallet is connected.');
      } else {
        toast.error('Failed to create creator profile.');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Create Profile</h2>
        <div className="flex flex-col gap-4">
          <input
            ref={nameRef}
            type="text"
            placeholder="Name"
            className="block w-full mb-4 px-4 py-2 bg-gray-700 rounded-lg"
          />
          <input
            ref={genreRef}
            type="text"
            placeholder="Genre or Work Title"
            className="block w-full mb-4 px-4 py-2 bg-gray-700 rounded-lg"
          />
          <input
            ref={addressRef}
            type="text"
            placeholder="Wallet Address"
            value={userAddress}
            readOnly
            className="block w-full mb-4 px-4 py-2 bg-gray-700 rounded-lg"
          />
          <input
            ref={avatarRef}
            type="text"
            placeholder="Avatar URL"
            className="block w-full mb-4 px-4 py-2 bg-gray-700 rounded-lg"
          />
        </div>
        <button
          className="px-4 py-2 bg-green-600 rounded-lg text-white mt-4"
          onClick={() =>
            createArtist(
              nameRef.current.value,
              genreRef.current.value,
              avatarRef.current.value,
              addressRef.current.value
            )
          }
        >
          Creator Sign Up
        </button>
      </div>
    </div>
  );
};

export default CreateArtistProfile;
