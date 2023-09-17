import { storage } from '../config/firebase';
import { firestore } from '../config/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateUserDoc } from './userHelpers';


export const fileUpload = async (user: { uid: string; } | null, directory: string, selectedFile: Blob | File, fieldKey: string): Promise<string> => {
    if (!selectedFile) {
        throw new Error('Missing parameter: selectedFile');
    }

    if (!directory) {
        throw new Error('Missing parameter: directory');
    }

    if (!user) {
        throw new Error('Missing parameter: user');
    }

    if (!fieldKey) {
        throw new Error('Missing parameter: fieldKey');
    }

    // Check if selectedFile is a Blob or a File object
    const blob = selectedFile instanceof Blob ? selectedFile : new Blob([selectedFile]);

    // Get the file extension
    const fileExtension = blob.type.split('/').pop() || 'jpeg';

    // Construct the new file name with userDocId and extension
    const newFileName = `${user.uid}.${fileExtension}`;

    // Create a reference with the new file name
    const storageRef = ref(storage, `${directory}/${newFileName}`);

    // Convert Blob to ArrayBuffer
    const arrayBuffer = await blob.arrayBuffer();

    // Create a Blob from the ArrayBuffer
    const fileBlob = new Blob([arrayBuffer], { type: blob.type });

    await uploadBytes(storageRef, fileBlob);

    const downloadURL = await getDownloadURL(storageRef);

    // Update user document with the downloadURL
    try {
        await updateUserDoc(user, { [fieldKey]: downloadURL });
        console.log('Profile updated successfully.');
    } catch (error) {
        console.error('Error updating profile:', error);
    }

    return downloadURL;
};

/**
 * Deletes a file from Firebase storage and updates the user's document.
 *
 * @param {object} user - The user object.
 * @param {string | null} fileURL - The URL of the file to be deleted.
 * @returns {Promise<void>}
 */
export const fileDelete = async (user: { userDocId: string }, fileURL: string | null): Promise<void> => {
    try {
        const fileExtension = fileURL ? fileURL.split('.').pop()?.split('?')[0] : null;

        if (fileExtension) {
            const storageRefPath = `userPhotos/${user.userDocId}.${fileExtension}`;
            const storageRef = ref(storage, storageRefPath);

            await deleteObject(storageRef);
            console.log('Photo deleted successfully.');

            // Update user document in Firestore to remove photoURL field
            const userDocRef = doc(firestore, 'users', user.userDocId);
            await updateDoc(userDocRef, {
                photoURL: null, // Set photoURL to null or delete the field entirely
            });
            console.log('User document updated.');
        } else {
            console.log('No photo to delete.');
        }
    } catch (error) {
        console.error('Error deleting photo:', error);
    }
};
