import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import Modal from 'react-modal';

const ActiveSubscriptions = ({ signer }) => {
  const [subscribedContents, setSubscribedContents] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    // Get user address
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
    if (userAddress) {
      fetchExclusiveContents();
    }
  }, [userAddress]);

  const fetchExclusiveContents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'nibiartists'));
      const contents = [];

      querySnapshot.forEach((doc) => {
        const artistData = doc.data();
        const subscribedTiers = artistData.subscribers?.filter(sub => sub.address === userAddress);

        if (subscribedTiers && subscribedTiers.length > 0) {
          subscribedTiers.forEach(sub => {
            const tier = artistData.tiers.find(t => t.name === sub.tier);
            if (tier && tier.contentValue) {
              contents.push({
                artist: artistData.name,
                tier: sub.tier,
                contentType: tier.contentType,
                contentValue: tier.contentValue
              });
            }
          });
        } 
        if (subscribedTiers && subscribedTiers.length === 0) {
          toast.error('You are not subscribed to any exclusive content yet.');
        }
      });

      setSubscribedContents(contents);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to fetch subscribed content');
    }
  };

  const handleCardClick = (content) => {
    setModalContent(content);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4"> Your Exclusive Contents</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscribedContents.map(({ artist, tier, contentType, contentValue }, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded-lg cursor-pointer overflow-hidden relative"
              style={{ paddingBottom: '100%' }} // Square ratio
              onClick={() => handleCardClick({ artist, tier, contentType, contentValue })}
            >
              <div className="absolute inset-0 p-4 flex flex-col justify-center items-center">
                <h3 className="text-lg font-bold text-center">{artist}</h3>
                <p className="text-sm text-center">{tier}</p>
                {contentType === 'image' && (
                  <img src={contentValue} alt="Exclusive Content" className="w-full h-full object-cover rounded-lg" />
                )}
                {contentType === 'audio' && (
                  <div className="w-full">
                    <audio controls className="w-full">
                      <source src={contentValue} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
                {contentType === 'video' && (
                  <div className="w-full">
                    <video controls className="w-full h-full object-cover rounded-lg">
                      <source src={contentValue} type="video/mp4" />
                      Your browser does not support the video element.
                    </video>
                  </div>
                )}
                {contentType === 'pdf' && (
                  <div className="text-blue-500 underline">PDF Document</div>
                )}
                {contentType === 'url' && (
                  <div className="text-blue-500 underline">Go to URL</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalContent && (
        <Modal
          isOpen={!!modalContent}
          onRequestClose={closeModal}
          className="modal"
          overlayClassName="modal-overlay"
        >
          <div className="modal-content">
            <button onClick={closeModal} className="modal-close">X</button>
            <h3 className="text-lg font-bold">{modalContent.artist}</h3>
            <p className="text-sm">{modalContent.tier}</p>
            {modalContent.contentType === 'image' && (
              <img src={modalContent.contentValue} alt="Exclusive Content" className="w-full rounded-lg" />
            )}
            {modalContent.contentType === 'audio' && (
              <audio controls className="w-full">
                <source src={modalContent.contentValue} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
            {modalContent.contentType === 'video' && (
              <video controls className="w-full">
                <source src={modalContent.contentValue} type="video/mp4" />
                Your browser does not support the video element.
              </video>
            )}
            {modalContent.contentType === 'pdf' && (
              <iframe src={modalContent.contentValue} className="w-full h-full" />
            )}
            {modalContent.contentType === 'url' && (
              <a href={modalContent.contentValue} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                Go to URL
              </a>
            )}
          </div>
        </Modal>
      )}

      {feedback && (
        <div className="mt-8">
          <p className="text-red-500">{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default ActiveSubscriptions;

// Styles for modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxHeight: '90vh',
    overflowY: 'auto',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    padding: '20px'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  }
};

Modal.defaultStyles.content = customStyles.content;
Modal.defaultStyles.overlay = customStyles.overlay;
