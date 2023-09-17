import {collection, doc, setDoc, connectFirestoreEmulator} from 'firebase/firestore';
import {firebase} from './firebase';
import {getFirestore} from "firebase/firestore";

// Initialize Firestore
const firestore = getFirestore(firebase); // Initialize Firestore

// Set the auth emulator
if (process.env.NODE_ENV === 'development') {
    connectFirestoreEmulator(firestore, 'localhost', 8080);
}

// Create the engagements collection if it doesn't exist
const engagementsCollectionRef = collection(firestore, 'engagements');

// Try to set a document in the collection (will create or update)
setDoc(doc(engagementsCollectionRef, 'exampleDoc'), {exampleField: 'exampleValue'}, {merge: true})
    .then(() => {
        console.log('Engagements collection exists or has been created.');
    })
    .catch((error) => {
        console.error('Error creating engagements collection:', error);
    });

// Create the polls collection if it doesn't exist
const pollsCollectionRef = collection(firestore, 'polls');

// Try to set a document in the collection (will create or update)
setDoc(doc(pollsCollectionRef, 'exampleDoc'), {exampleField: 'exampleValue'}, {merge: true})
    .then(() => {
        console.log('Polls collection exists or has been created.');
    })
    .catch((error) => {
        console.error('Error creating polls collection:', error);
    });

// Create the badges collection if it doesn't exist
const badgesCollectionRef = collection(firestore, 'badges');

// Try to set a document in the collection (will create or update)
setDoc(doc(badgesCollectionRef, 'exampleDoc'), {exampleField: 'exampleValue'}, {merge: true})
    .then(() => {
        console.log('Badges collection exists or has been created.');
    })
    .catch((error) => {
        console.error('Error creating badges collection:', error);
    });

// Create the users collection if it doesn't exist
const usersCollectionRef = collection(firestore, 'users');

// Try to set a document in the collection (will create or update)
setDoc(doc(usersCollectionRef, 'exampleDoc'), {exampleField: 'exampleValue'}, {merge: true})
    .then(() => {
        console.log('Users collection exists or has been created.');
    })
    .catch((error) => {
        console.error('Error creating users collection:', error);
    });

// Export the initialized Firestore instance
export {
    firestore,
};
