import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useLocalStorage } from 'usehooks-ts';
import { createDocument, readDocument, readDocumentsByField } from '@/api/firebase/master/firestoreCrud';
import { USER_COLLECTION } from '@/constants/collections';
export const useCheckUser = (signedAccountId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userExists, setUserExists] = useState(false);

  const router = useRouter();
  const [user, setUser] = useLocalStorage('user', null);
  
  // Add a ref to ensure the checkUser function is called only once per session
  const hasCheckedUser = useRef(false);

  const checkUser = async () => {
    if (hasCheckedUser.current) return; // Prevent multiple calls
    hasCheckedUser.current = true; // Mark as checked

    if (!signedAccountId) {
      console.error('No wallet connected');
      hasCheckedUser.current = false;
      return;
    }

    setLoading(true);
    setError(null);

    try {
      //console.log('checkUser function called once');

      // Fetch user from Firestore by walletAddress
      const userDoc = await readDocumentsByField(USER_COLLECTION, 'walletAddress', signedAccountId);
      //console.log('Fetched user doc:', userDoc);
      const existingDoc = userDoc?.[0];

      if (!existingDoc) {
        // If user doesn't exist, add them to Firestore
        const userId = await createDocument(USER_COLLECTION, {
          walletAddress: signedAccountId,
          createdAt: new Date(),
        });

        const userData = await readDocument(USER_COLLECTION,userId);
        // Save new user in local storage
        setUser({
          userData
        });

        //console.log('New user created in Firestore.');
        setUserExists(false);
      } else {
        // If user already exists, update local storage with existing data
        setUser(existingDoc);
        setUserExists(true);
      }

      // Navigate to home page after user is found or created
       router.push('/user/');
    
    } catch (error) {
      console.error('Error checking/adding user to Firestore:', error);
      setError(error);
    } finally {
      setLoading(false);
      hasCheckedUser.current = false; // Reset the check for the next session
    }
  };

  const getWalletAddressById = async (userId) => {
    try {
      // Fetch the user document by the provided ID
      const userDoc = await readDocument(USER_COLLECTION, userId);
  
      // If the document is not found, return an appropriate message or null
      if (!userDoc) {
        console.error(`No user found with ID: ${userId}`);
        return null;
      }
  
      // Return the walletAddress from the retrieved document
      return userDoc.walletAddress;
    } catch (error) {
      console.error(`Error fetching wallet address for user ID ${userId}:`, error);
      return null;
    }
  };

  // useEffect to only trigger the check once per session
  useEffect(() => {
    if (signedAccountId && !userExists && !hasCheckedUser.current) {
      checkUser(); // Only call checkUser when signedAccountId is available and user doesn't exist
    }
  }, [signedAccountId, userExists]);

  return { checkUser, loading, error, userExists,getWalletAddressById };
};
