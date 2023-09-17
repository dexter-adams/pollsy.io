import {collection, doc, getDoc, getDocs, QueryDocumentSnapshot, setDoc} from 'firebase/firestore';
import { firestore } from '../config/firestore';

// Define the Poll type
interface Poll {
    id: string;
    author: string;
    question: string;
    createdAt: string;
}

// Initialize cachedPolls as an empty array at the module level
const cachedPolls: Poll[] = [];

export const getPolls = async (): Promise<Poll[]> => {
    try {
        // If there are cached polls, return them directly
        if (cachedPolls.length > 0) {
            return cachedPolls;
        }

        const pollsCollection = collection(firestore, 'polls');
        const pollsSnapshot = await getDocs(pollsCollection);

        const pollsData: Poll[] = pollsSnapshot.docs.map((doc: QueryDocumentSnapshot) => ({
            id: doc.id,
            author: doc.data().author, // Use doc.data().author to access the author field
            question: doc.data().question,
            createdAt: doc.data().createdAt, // Use doc.data().createdAt to access the createdAt field
        }));

        // Clear the cachedPolls array before caching new data
        cachedPolls.length = 0;
        cachedPolls.push(...pollsData);

        return pollsData;
    } catch (error) {
        console.error('Error fetching polls:', error);
        throw error; // Re-throw the error to handle it at a higher level
    }
};


// Function to initialize vote counts in Firestore for a specific poll
export const initializeVoteCount = async (pollId: string | undefined) => {
    const voteCountRef = doc(collection(firestore, 'pollVoteCounts'), pollId);

    // Check if the vote count document exists
    const voteCountDoc = await getDoc(voteCountRef);
    if (!voteCountDoc.exists()) {
        // If it doesn't exist, initialize it with a voteCount of 0
        await setDoc(voteCountRef, { voteCount: 0 });
    }
};

// Function to retrieve the vote count for a specific poll using the poll's ID
export const getVoteCountForPoll = async (pollId: string | undefined) => {
    const voteCountRef = doc(collection(firestore, 'pollVoteCounts'), pollId);

    // Retrieve the vote count document
    const voteCountDoc = await getDoc(voteCountRef);

    // If the document exists, return its voteCount; otherwise, return 0
    if (voteCountDoc.exists()) {
        const data = voteCountDoc.data();
        if (data && data.voteCount) {
            return data.voteCount;
        }
    }

    return 0; // Default to 0 if the document doesn't exist
};

// Function to update the vote count for a specific poll
export const updateVoteCountForPoll = async (pollId: string | undefined, newVoteCount: any) => {
    const voteCountRef = doc(collection(firestore, 'pollVoteCounts'), pollId);

    // Update the vote count in Firestore
    await setDoc(voteCountRef, { voteCount: newVoteCount });
};
