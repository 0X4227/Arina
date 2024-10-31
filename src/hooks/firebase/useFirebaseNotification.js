import { useEffect, useState, useRef } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { createDocument, readDocumentsByField, updateDocument } from '@/api/firebase/master/firestoreCrud';
import { useLocalStorage } from 'usehooks-ts';
import { NOTIFICATION_COLLECTION } from '@/constants/collections';

// Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);

const useFirebaseNotification = () => {
  const [user, setUser] = useLocalStorage('user', null);
  const userId = user?.id;
  const [permissionGranted, setPermissionGranted] = useState(false);
  const initializedRef = useRef(false);  // Lock to prevent double execution

  // Debugging - Track the rendering and state changes
  //console.log('useFirebaseNotification hook triggered');

  useEffect(() => {
    // Prevent execution if already initialized
    if (initializedRef.current) {
      //console.log('Already initialized, skipping initialization...');
      return;
    }
    //console.log('Initializing Firebase messaging...');

    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setPermissionGranted(true);
        initializeMessaging(); // Initialize Firebase messaging if permission is already granted
      } else if (Notification.permission !== 'denied') {
        requestNotificationPermission(); // Request permission if not yet denied
      }
    }

    initializedRef.current = true; // Mark as initialized after the first run

  }, []); // Empty array ensures this only runs once after the component mounts

  const requestNotificationPermission = () => {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        setPermissionGranted(true);
        initializeMessaging();
      } else {
        //console.log('Notification permission denied.');
      }
    });
  };

  const initializeMessaging = () => {
    //console.log("inside initialize Messaging");
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js', { scope: '/' })
      .then((registration) => {
        
        const messaging = getMessaging(app);
        getToken(messaging, { vapidKey: 'BE2_mXRirANCr2i0rufp8gzlELryV0AuZxl1XOqrWcGlc7iYCG4UOObO9DkOixNMdsYJ3xd8-tCYchlL8a-ce24', serviceWorkerRegistration: registration })
          .then(async (currentToken) => {
            if (currentToken) {
              await saveTokenToFirestore(currentToken); // Save the token to Firestore
            } else {
            }
          })
          .catch((error) => {
            console.error('Error retrieving FCM token:', error);
          });

        onMessage(messaging, (payload) => {
          //console.log('Message received. ', payload);
          // Handle foreground messages here (e.g., show notifications)
        });
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  };

  const saveTokenToFirestore = async (token) => {
    try {
      // Check if the document with this token already exists in the 'notification' collection
      const userDoc = await readDocumentsByField(NOTIFICATION_COLLECTION, 'fcmToken', token);
      const existingDoc = userDoc?.[0];

      if (existingDoc) {
        // If the document exists, update the userId if not already present
        if (!existingDoc?.userId && userId) {
          await updateDocument('notification', existingDoc.id, { userId });
          //console.log('Updated existing document with userId.');
        } else {
          //console.log('FCM token and userId already exist in Firestore.');
        }
      } else {
        // If the document does not exist, create a new document
        const data = userId ? { fcmToken: token, userId } : { fcmToken: token };
        await createDocument('notification', data);
        //console.log('New document created with FCM token.');
      }
    } catch (error) {
      console.error('Error saving FCM token to Firestore:', error);
    }
  };

  return (
    <div>
      {!permissionGranted && (
        <button onClick={requestNotificationPermission}>Enable Notifications</button>
      )}
      {permissionGranted && <p>Notifications Enabled</p>}
    </div>
  );
};

export default useFirebaseNotification;
