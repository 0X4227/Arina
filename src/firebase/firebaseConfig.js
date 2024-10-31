import firebase from "firebase/compat/app";
import "firebase/compat/auth"; // Import Firebase Authentication
import "firebase/compat/firestore"; // Import Firestore
import "firebase/compat/storage"; // Import Firebase Storage
const config = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

let app;
if (!firebase.apps.length) { // condition that multiple instances of firebase is not created
    app = firebase.initializeApp(config); // it initialize the firebase app
}

// Messaging service
export const firestore = firebase.firestore();
export const storage = firebase.storage(); // Export Firebase Storage

// export { firestore };
export default firebase;