import {collection, doc, DocumentReference, getDoc, getDocs, updateDoc} from 'firebase/firestore';
import {firestore} from '../config/firestore';
import {updateBadges} from './badgeHelpers'; // Firebase imports
import {fetchUserData} from "./userHelpers";

interface PollChoice {
    id: string;
    choiceText: string;
    choiceVotes: any[];
}

interface UserDocData {
    badges?: string[];
    votedPolls?: string[];
}

export const getPollChoices = async (pollId: string): Promise<PollChoice[]> => {
    if (!pollId) {
        // Handle the case where pollId is undefined or falsy
        return [];
    }

    const choicesRef = collection(firestore, 'polls', pollId, 'choices');

    try {
        const querySnapshot = await getDocs(choicesRef);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            choiceText: doc.data().choiceText, // Replace with the actual field name in Firestore
            choiceVotes: doc.data().choiceVotes || [], // Replace with the actual field name in Firestore
        }));
    } catch (error) {
        console.error('Error getting choices:', error);
        return []; // Return an empty array in case of an error
    }
};


export const calculateInitialVoteCounts = (choicesData: PollChoice[]): Record<string, number> => {
    const initialVoteCounts: Record<string, number> = {};

    choicesData.forEach((choice) => {
        initialVoteCounts[choice.id] = choice.choiceVotes ? choice.choiceVotes.length : 0;
    });

    return initialVoteCounts;
};

export const calculateTotalVotes = async (pollId: string): Promise<number> => {
    try {
        const choicesData = await getPollChoices(pollId); // Await the getPollChoices function
        let totalVotes = 0;

        // Loop through the choices to sum up the votes
        choicesData.forEach((choice) => {
            const choiceVotes = choice.choiceVotes ? choice.choiceVotes.length : 0;
            totalVotes += choiceVotes;
        });

        return totalVotes;
    } catch (error) {
        console.error('Error calculating total votes:', error);
        return 0; // Return 0 in case of an error
    }
};

export const getLeadingPollChoice = async (choices: PollChoice[]): Promise<PollChoice | undefined> => {
    try {
        let leadingPollChoice: PollChoice | undefined;
        let leadingVotes = 0;

        choices.forEach((choice) => {
            const votesCount = choice.choiceVotes ? choice.choiceVotes.length : 0;

            if (votesCount > leadingVotes) {
                leadingVotes = votesCount;
                leadingPollChoice = choice;
            }
        });

        return leadingPollChoice;
    } catch (error) {
        console.error('Error calculating leading choice:', error);
        return undefined;
    }
};

export const handleVoteAdd = async (
    choiceRef: DocumentReference,
    choiceVotes: any[], // Replace with the actual type
    currentUserId: string,
    id: string,
    choiceId: string,
    choices: PollChoice[] // Use the 'PollChoice' interface
): Promise<{
    userVotes: Record<string, boolean>;
    activePollChoice: string | null;
    message: string;
    choices: PollChoice[]; // Use the 'PollChoice' interface
}> => {
    const updatedPollChoiceVotes = [...choiceVotes, {userId: currentUserId}];
    await updateDoc(choiceRef, {choiceVotes: updatedPollChoiceVotes});

    const userRef = doc(firestore, 'users', currentUserId);
    const userDoc = await getDoc(userRef);

    const userExists = await fetchUserData(currentUserId);

    if (userExists) {
        const userDocData: UserDocData = userDoc.data() as UserDocData;
        const votedPolls = userDocData.votedPolls || [];

        if (!votedPolls.includes(id)) {
            await handleBadgeUpdates(userRef, votedPolls, choiceVotes);
        }

        const updatedPollChoices = choices.map((choice) => {
            if (choice.id === choiceId) {
                return {...choice, choiceVotes: updatedPollChoiceVotes};
            }
            return choice;
        });

        return {
            userVotes: {[choiceId]: true},
            activePollChoice: choiceId,
            message: `Vote added successfully: ${choiceId}`,
            choices: updatedPollChoices,
        };
    }

    // Return a default value that matches the return type
    return {
        userVotes: {},
        activePollChoice: null,
        message: '',
        choices: [],
    };
};

export const handleVoteRemove = async (
    choiceRef: DocumentReference,
    choiceVotes: any[], // Replace with the actual type
    currentUserId: string,
    id: string,
    choiceId: string,
    choices: PollChoice[] // Use the 'PollChoice' interface
): Promise<{
    userVotes: Record<string, boolean>;
    activePollChoice: string | null;
    message: string;
    choices: PollChoice[]; // Use the 'PollChoice' interface
}> => {
    const updatedPollChoiceVotes = choiceVotes.filter((vote) => vote.userId !== currentUserId);
    await updateDoc(choiceRef, {choiceVotes: updatedPollChoiceVotes});

    const userRef = doc(firestore, 'users', currentUserId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
        const userDocData: UserDocData = userDoc.data() as UserDocData;
        const votedPolls = userDocData.votedPolls || [];
        const updatedVotedPolls = votedPolls.filter((pollId) => pollId !== id);

        await updateDoc(userRef, {votedPolls: updatedVotedPolls});

        // Update the choices state to reflect the removed vote
        const updatedPollChoices = choices.map((choice) => {
            if (choice.id === choiceId) {
                return {...choice, choiceVotes: updatedPollChoiceVotes};
            }
            return choice;
        });

        return {
            userVotes: {[choiceId]: true},
            activePollChoice: choiceId,
            message: `Vote removed successfully: ${choiceId}`,
            choices: updatedPollChoices,
        };
    }

    // Return a default value that matches the return type
    return {
        userVotes: {},
        activePollChoice: null,
        message: '',
        choices: [],
    };
};

export const handleBadgeUpdates = async (
    userRef: DocumentReference,
    votedPolls: string[],
    choiceVotes: any[]
): Promise<void> => {
    const userVotedCount = votedPolls.length;
    const totalVotesReceived = choiceVotes.reduce(
        (total, choiceVotes) => total + (choiceVotes ? choiceVotes.length : 0),
        0
    );

    // Badge criteria for voting
    const votingBadgeCriteria = [
        {badge: 'WyYyC0F8jLyGY7Q0gSvA', count: 1}, // First Voter
        {badge: 'jlGvXg19oO6iJfnw1TOQ', count: 10}, // Active Voter
        {badge: 'Sn7NQx1HnLTv9WWG0oVh', count: 25}, // Opinion Shaper
        {badge: 'bop3aAkT2LiU4Kempgbo', count: 50}, // Voice of the People
        {badge: 'QlrKYToPyN16BDpRSH7o', count: 100}, // Ultimate Decision Maker
    ];

    // Badge criteria for poll engagement
    const engagementBadgeCriteria = [
        {badge: 'AARuRL60MhrjPi4PFnEz', count: 1}, // Newbie Pollster
        {badge: 'wFTlkPdqEiAbDIVcObE8', count: 5}, // Active Poll Creator
        {badge: 'd58hD85qPpfDcwPb7BMw', count: 10}, // Creative Pollmaster
        {badge: 'mJs3aYuOYZFvC8BPgi2o', count: 20}, // Innovative Poll Enthusiast
        {badge: 'KxfAF1tDJfwla2LFUaxA', count: 50}, // Master Poll Architect
        {badge: 'LYNrltvgXLgBoT45pWhd', count: 50}, // Popular Poll Creator
        {badge: '6z7Z1eF6kqxgfSVEJI0z', count: 100}, // Influential Pollster
        {badge: '2BVoTBMf4BjvybefmtK7', count: 500}, // Viral Poll Guru
        {badge: 'FBeH9GQB6fOTpUD8TKAk', count: 1000}, // Trendsetter Poll Artist
        {badge: 'E7uWArgCMgU6mFhh0VaJ', count: 5000}, // Global Poll Phenomenon
    ];

    const allBadgeCriteria = [...votingBadgeCriteria, ...engagementBadgeCriteria];

    await updateBadges(userRef, allBadgeCriteria, userVotedCount);
    await updateDoc(userRef, {votedPolls: votedPolls});
};
