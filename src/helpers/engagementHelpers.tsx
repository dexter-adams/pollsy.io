import {collection, doc, getDoc, setDoc, query, where, getDocs, updateDoc, increment} from 'firebase/firestore';
import {firestore} from '../config/firestore';
import  {firebase} from "../config/firebase";

export const updateVotes = async (pollId: string, newVoteCount: any) => {
    const pollEngagementDocRef = doc(firestore, 'engagements', pollId);

    // Get the current engagement data
    const docSnapshot = await getDoc(pollEngagementDocRef);
    if (docSnapshot.exists()) {
        const currentEngagementData = docSnapshot.data();

        // Update the votes count
        currentEngagementData.votes = newVoteCount;

        // Update the document in Firestore
        await setDoc(pollEngagementDocRef, currentEngagementData);
    }
};

export const getEngagementMetrics = async (pollId: unknown) => {
    const engagementQuery = query(
        collection(firestore, 'engagements'),
        where('pollId', '==', pollId)
    );

    const querySnapshot = await getDocs(engagementQuery);
    if (!querySnapshot.empty) {
        // Process and use the engagement data
        const engagementData = querySnapshot.docs[0].data();
        console.log(engagementData);
    }
};

export const getCurrentVoteCountForPoll = async (pollId: string) => {
    try {
        const pollRef = doc(firestore, 'polls', pollId); // Assuming 'polls' is your collection name

        const pollDoc = await getDoc(pollRef);

        if (pollDoc.exists()) {
            const pollData = pollDoc.data();
            return pollData.votes; // Assuming 'votes' is the field storing vote count
        } else {
            new Error('Poll not found');
        }
    } catch (error) {
        console.error('Error getting current vote count:', error);
        throw error;
    }
};;

export const incrementViewCount = async (pollId: string) => {
    const engagementDocRef = doc(firestore, 'engagements', pollId); // Adjust the path accordingly

    try {
        await updateDoc(engagementDocRef, {
            viewCount: increment(1), // Use increment function
        });
    } catch (error) {
        console.error('Error incrementing view count:', error);
        throw error;
    }
};

export const getViewCountForPoll = async (pollId: string) => {
    const pollDocRef = doc(firestore, 'polls', pollId); // Adjust the path accordingly

    try {
        const pollDoc = await getDoc(pollDocRef);
        if (pollDoc.exists()) {
            const pollData = pollDoc.data();
            return pollData.viewCount || 0; // Default to 0 if viewCount is undefined
        } else {
            new Error('Poll not found');
        }
    } catch (error) {
        console.error('Error getting view count:', error);
        throw error;
    }
};