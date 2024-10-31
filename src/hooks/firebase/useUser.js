import { useState, useEffect } from 'react';
import { readDocument } from '@/api/firebase/master/firestoreCrud';
import { USER_COLLECTION } from '@/constants/collections';

export const useUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userExists, setUserExists] = useState(false);

  const getWalletAddressById = async (userId) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch the user document by the provided ID
      const userDoc = await readDocument(USER_COLLECTION, userId);

      // If the document is not found, return null
      if (!userDoc) {
        console.error(`No user found with ID: ${userId}`);
        return null;
      }

      // Update userExists state if the user was found
      setUserExists(true);

      // Return the walletAddress from the retrieved document
      return userDoc.walletAddress;
    } catch (error) {
      console.error(`Error fetching wallet address for user ID ${userId}:`, error);
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getWalletAddressById, loading, error, userExists };
};
