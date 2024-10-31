import {
  doc,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  setDoc,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { firestore } from "@/firebase/firebaseConfig";

// Create a new document with an auto-generated ID
const createDocument = async (collectionName, document) => {
  try {
    // Add the document and get the auto-generated ID
    const docRef = await addDoc(collection(firestore, collectionName), document);

    // After the document is added, update it by setting its ID in the document data
    await updateDoc(docRef, { id: docRef.id });

    // Return the generated ID
    return docRef.id;
  } catch (error) {
    // console.error("Error adding document: ", error);
    throw error;
  }
};

// Create or update a document with a custom ID
const createDocumentWithCustomId = async (collectionName, document, customId) => {
  try {
    const docRef = doc(firestore, collectionName, customId);
    await setDoc(docRef, document);
    return docRef.id;
  } catch (error) {
    // console.error("Error setting document with custom ID: ", error);
    throw error;
  }
};

// Read a single document by ID
const readDocument = async (collectionName, id) => {
  try {
    const docRef = doc(firestore, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      // console.error("No such document!");
      return null;
    }
  } catch (error) {
    // console.error("Error getting document: ", error);
    throw error;
  }
};

// Read documents based on a field and value dynamically
const readDocumentsByField = async (collectionName, field, value) => {
  try {
    const q = query(collection(firestore, collectionName), where(field, '==', value));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      return documents;
    } else {
      // console.warn(`No documents found with ${field}: ${value}`);
      return null;
    }
  } catch (error) {
    // console.error(`Error reading documents where ${field} equals ${value}:`, error);
    throw error;
  }
};

const readDocumentsByOrdered = async (collectionName, field, value, orderField, orderDirection) => {
  try {
    // Create a query with where and orderBy clauses
    const q = query(
      collection(firestore, collectionName),
      where(field, '==', value),
      orderBy(orderField, orderDirection) // Add the orderBy clause
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      return documents;
    } else {
      // console.warn(`No documents found with ${field}: ${value}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
};

const getDocumentsByQuery = async (collectionName, conditions) => {
  try {
    // Reference to the collection
    const collectionRef = collection(firestore, collectionName);

    // Dynamically build the query based on the provided conditions
    let q = query(collectionRef);
    conditions.forEach((condition) => {
      const { field, operator, value } = condition;
      q = query(q, where(field, operator, value));
    });

    // Fetch the documents that match the query
    const querySnapshot = await getDocs(q);

    // Map over the documents and extract their data
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return documents;
  } catch (error) {
    console.error("Error fetching documents by query:", error);
    throw new Error("Failed to fetch documents by query");
  }
};
// Update an existing document by ID
const updateDocument = async (collectionName, id, document) => {
  try {
    const docRef = doc(firestore, collectionName, id);
    await updateDoc(docRef, document);
    // //console.log("Document successfully updated!");
  } catch (error) {
    // console.error("Error updating document: ", error);
    throw error;
  }
};

// Delete a document by ID
const deleteDocument = async (collectionName, id) => {
  try {
    const docRef = doc(firestore, collectionName, id);
    await deleteDoc(docRef);
    ////console.log("Document successfully deleted!");
  } catch (error) {
    // console.error("Error deleting document: ", error);
    throw error;
  }
};

// Export all Firestore CRUD functions
export {
  createDocument,
  createDocumentWithCustomId,
  readDocument,
  updateDocument,
  deleteDocument,
  readDocumentsByField,
  getDocumentsByQuery,
  readDocumentsByOrdered
};
