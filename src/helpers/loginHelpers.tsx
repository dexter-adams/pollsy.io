import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {firestore} from '../config/firestore'; // Replace with your actual import for firestore
import {fetchUserData, updateUserDoc} from './userHelpers';
import {doc, getDoc, setDoc} from "firebase/firestore";
import {storage} from "../config/firebase"; // Import your user-related functions

export const handleDownloadAndStorePhotoURL = async (user: any) => {
    if (!user.photoURL) {
        return null;
    }

    const storageRef = ref(storage, `userPhotos/${user.uid}`);
    await uploadBytes(storageRef, user.photoURL);
    const newPhotoURL = await getDownloadURL(storageRef);

    // Update user document with new photoURL
    await updateUserDoc(user, {photoURL: newPhotoURL});

    return newPhotoURL;
};

// Shared helper function to handle user document creation and userDocId retrieval
export const handleUserDoc = async (user: any) => {
    try {
        const userData = await fetchUserData(user.uid);

        if (userData) {
            // User document with the provided UID already exists
            return userData;
        } else {
            // No matching user document found, create a new user document
            const newUserDocRef = doc(firestore, 'users', user.id); // Specify the ID as user.id

            const additionalUserData = {
                email: user.email,
                // Add any other required user data here
            };

            await setDoc(newUserDocRef, additionalUserData); // Use setDoc to create the document

            // Return the newly created user document
            return await fetchUserData(user.id);
        }
    } catch (error) {
        console.error('Error checking or creating user document: ', error);
        return null;
    }
};