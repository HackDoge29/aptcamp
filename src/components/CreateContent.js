import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, getDocs, updateDoc, doc, getDoc, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from './firebaseConfig';


const CreateContent = ({ signer }) => {
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('');
  const [membershipTier, setMembershipTier] = useState('');
  const [exclusiveContent, setExclusiveContent] = useState('');
  const [membershipPrice, setMembershipPrice] = useState('');
  const [benefits, setBenefits] = useState('');
  const [contentType, setContentType] = useState('');
  const [contentFile, setContentFile] = useState(null);
  const [userAddress, setUserAddress] = useState('');

  const membershipTiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
  const contentTypes = ['video', 'image', 'audio', 'pdf', 'url'];

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
      if (userAddress) {
        try {
          const q = query(collection(db, 'nibiartists'), where('address', '==', userAddress));
          const querySnapshot = await getDocs(q);
          const artistsList = querySnapshot.docs.map((doc) => ({
            docId: doc.id, // Store Firestore document ID
            ...doc.data(),
          }));
          setArtists(artistsList);
        } catch (error) {
          console.error('Error fetching artists:', error);
          toast.error('Failed to fetch artists');
        }
      }
    };

    fetchArtists();
  }, [userAddress]);

  const handleFileChange = (e) => {
    setContentFile(e.target.files[0]);
  };

  const uploadFileToStorage = async (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, `content/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };




  const createContent = async (artistDocId, tier, price, benefits, contentType, contentValue) => {
    try {
      if (!userAddress) {
        toast.error('Please sign in to create content');
        return;
      }

      if (!artistDocId || !tier || !price || !benefits || !contentType || !contentValue) {
        toast.error('Please fill in all fields');
        return;
      }

    

      let contentURL = contentValue;
      if (contentType !== 'url') {
        contentURL = await uploadFileToStorage(contentValue);
      }

      const artistDocRef = doc(db, 'nibiartists', artistDocId);

      const artistDoc = await getDoc(artistDocRef);

      if (!artistDoc.exists()) {
        toast.error('Selected creator does not exist');
        return;
      }

      const artistData = artistDoc.data();
      const updatedTiers = [
        ...artistData.tiers,
        { name: tier, price, benefits, contentType, contentValue: contentURL },
      ];

      await updateDoc(artistDocRef, { tiers: updatedTiers });

      toast.success('Content created successfully');
    } catch (error) {
      console.error('Error creating content:', error);
      toast.error('Failed to create content');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Create Content</h2>

        <select
          value={selectedArtist}
          onChange={(e) => setSelectedArtist(e.target.value)}
          className="block w-full mb-4 px-4 py-2 bg-gray-700 rounded-lg"
        >
          <option value="">Select Creator</option>
          {artists.map((artist) => (
            <option key={artist.docId} value={artist.docId}>
              {artist.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Creator Wallet Address"
          value={userAddress}
          readOnly
          className="block w-full mb-4 px-4 py-2 bg-gray-700 rounded-lg"
        />

        <select
          value={membershipTier}
          onChange={(e) => setMembershipTier(e.target.value)}
          className="block w-full mb-4 px-4 py-2 bg-gray-700 rounded-lg"
        >
          <option value="">Select Tier</option>
          {membershipTiers.map((tier) => (
            <option key={tier} value={tier}>
              {tier}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Price in APT"
          value={membershipPrice}
          onChange={(e) => setMembershipPrice(e.target.value)}
          className="block w-full mb-4 px-4 py-2 bg-gray-700 rounded-lg"
        />

        <input
          type="text"
          placeholder="Benefits (comma separated)"
          value={benefits}
          onChange={(e) => setBenefits(e.target.value)}
          className="block w-full mb-4 px-4 py-2 bg-gray-700 rounded-lg"
        />

        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          className="block w-full mb-4 px-4 py-2 bg-gray-700 rounded-lg"
        >
          <option value="">Select Content Type</option>
          {contentTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {contentType !== 'url' && (
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full mb-4 px-4 py-2 bg-gray-700 rounded-lg"
          />
        )}

        {contentType === 'url' && (
          <input
            type="text"
            placeholder="Content URL"
            value={exclusiveContent}
            onChange={(e) => setExclusiveContent(e.target.value)}
            className="block w-full mb-4 px-4 py-2 bg-gray-700 rounded-lg"
          />
        )}

        <button
          className="px-4 py-2 bg-green-600 rounded-lg text-white"
          onClick={() =>
            createContent(
              selectedArtist,
              membershipTier,
              membershipPrice,
              benefits,
              contentType,
              contentType === 'url' ? exclusiveContent : contentFile
            )
          }
        >
          Create Content
        </button>
      </div>
    </div>
  );
};

export default CreateContent;
