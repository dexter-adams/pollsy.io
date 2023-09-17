import defaultUserThumb from '../images/default-user.svg';
import {firestore} from '../config/firestore';
import {addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where,} from 'firebase/firestore';
import {useEffect, useState} from 'react';
import {getPollChoices} from './voteHelpers';

// Define types
interface UserData {
    // Define your UserData type here
    // Example:
    id: string;
    email: string;
    photoURL?: string;
    // Add any other properties as needed
}

// Store cached user data
const cachedUserData: { [userId: string]: UserData } = {};

export const fetchUserData = async (
    userId: string
): Promise<UserData | boolean> => {
    try {
        if (cachedUserData[userId]) {
            // If user data is already cached, return it
            return cachedUserData[userId];
        }

        const userRef = doc(firestore, 'users', userId); // Assuming 'users' is your collection name
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data() as UserData;
            // Cache the user data
            cachedUserData[userId] = userData;
            return userData;
        } else {
            console.log('User document does not exist.');
            return false;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        return false;
    }
};

// Store cached username availability
const cachedUsernameAvailability: { [username: string]: boolean } = {};

export const checkUsernameAvailability = async (
    username: string
): Promise<boolean> => {
    try {
        if (cachedUsernameAvailability[username] !== undefined) {
            // If username availability is cached, return it
            return cachedUsernameAvailability[username];
        }

        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Username exists
            cachedUsernameAvailability[username] = false;
            return false;
        } else {
            // Username is available
            cachedUsernameAvailability[username] = true;
            return true;
        }
    } catch (error) {
        console.error('Error checking username availability:', error);
        return false; // Return false in case of an error
    }
};

// Create a cache object to store previously fetched user IDs
const userIdCache: { [firebaseUserId: string]: string | null } = {};

// Create an object to serve as the cache
const emailToUserDocIdCache: { [email: string]: string | null } = {};

export const getUserDocIdByEmail = async (email: string): Promise<string | null> => {
    try {
        // Check if the email is already in the cache
        if (emailToUserDocIdCache[email]) {
            console.log('Fetching userDocId from cache for email:', email);
            return emailToUserDocIdCache[email];
        }

        console.log('Fetching userDocId for email:', email);

        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // User document with the provided email already exists
            const userDoc = querySnapshot.docs[0];
            const userDocId = userDoc.id;

            // Cache the result for future use
            emailToUserDocIdCache[email] = userDocId;

            console.log('Found userDocId:', userDocId);
            return userDocId;
        } else {
            // No matching user found, create a new user document
            console.log('No matching user found for email:', email);
            const newUser = {
                email: email,
                // Add any other required user data here
            };

            // Add the new user document to Firestore
            const newUserRef = await addDoc(usersRef, newUser);
            const userDocId = newUserRef.id;

            // Cache the result for future use
            emailToUserDocIdCache[email] = userDocId;

            console.log('Created new user document with ID:', userDocId);
            return userDocId;
        }
    } catch (error) {
        console.error('Error fetching or creating user doc ID:', error);
        return null;
    }
};

export const updateUserDoc = async (
    user: { uid: string } | null,
    fields: Record<string, any> = {}
): Promise<boolean> => {
    try {
        if (user?.uid) {
            const userRef = doc(firestore, 'users', user.uid);
            await updateDoc(userRef, fields);
            console.log('Document successfully updated.');
            return true; // Successfully updated user document
        } else {
            console.error('Error updating user document: There was a problem with the user document ID provided.');
            return false;
        }
    } catch (error) {
        console.error('Error updating user document:', error);
        return false; // Failed to update user document
    }
};

export const getUserPollsCount = async (userDocId: string) => {
    const userDocRef = doc(firestore, 'users', userDocId);

    try {
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
            const userData = docSnapshot.data();

            // Ensure that userData has the 'createdPolls' property and it's an array
            if (userData?.createdPolls instanceof Array) {
                return userData.createdPolls.length;
            } else {
                // If 'createdPolls' is missing or not an array, initialize it as an empty array
                await setDoc(userDocRef, {createdPolls: []}, {merge: true});
                return 0; // Return 0 as the user has no polls initially
            }
        } else {
            throw new Error("User document doesn't exist.");
        }
    } catch (error: any) {
        throw new Error('Error fetching user document: ' + error.message);
    }
};

export const getVotersPhotos = async (pollId: string) => {
    const votersPhotos: { userDocId: string; photoURL: string }[] = [];

    try {
        const choicesData = await getPollChoices(pollId);

        if (choicesData) {
            for (const choice of choicesData) {
                const choiceVotes = choice?.choiceVotes;

                if (choiceVotes && choiceVotes.length) {
                    for (const voterData of choiceVotes) {
                        const userDocId = voterData.userId;
                        try {
                            if (userDocId) {
                                try {
                                    const userData = await fetchUserData(userDocId);

                                    if (userData) {
                                        if (typeof userData !== "boolean") {
                                            const data = {
                                                userDocId: userDocId,
                                                photoURL: userData?.photoURL || defaultUserThumb,
                                            };

                                            votersPhotos.push(data);
                                        }
                                    }
                                } catch (userDataError) {
                                    console.log(userDataError);
                                }
                            } else {
                                new Error("User document doesn't exist.");
                            }
                        } catch (userDocIdError) {
                            console.log(userDocIdError);
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
    }

    return votersPhotos;
};

async function fetchUserPolls(userId: unknown) {
    console.log('User ID', userId);

    try {
        const pollsCollection = collection(firestore, 'polls');

        // Create a query that filters polls by user ID
        const q = query(pollsCollection, where('userId', '==', userId));

        // Execute the query and get the result
        const querySnapshot = await getDocs(q);

        // Extract and process the poll data from the query snapshot
        const userPolls: { id: string; question: any; }[] = [];
        querySnapshot.forEach((doc) => {
            const pollData = doc.data();
            userPolls.push({
                id: doc.id,
                question: pollData.question,
                // Add other poll properties here
            });
        });

        return userPolls;
    } catch (error: any) {
        throw new Error(`Error fetching user polls: ${error.message}`);
    }
}

export default fetchUserPolls;

