import styles from './VoteButtons.module.css';
import React, {useState, useEffect} from 'react';
import {onSnapshot, doc, DocumentReference} from 'firebase/firestore';
import {firestore} from '../../config/firestore';
import {IonIcon} from '@ionic/react';
import {chevronUpOutline, chevronDownOutline} from 'ionicons/icons';
import {updateVotes, getCurrentVoteCountForPoll} from "../../helpers/engagementHelpers";

interface VoteButtonsProps {
    pollId: string;
    choiceId: string;
    isActiveChoice: string | null;
    handleVote: (choiceId: string, increment: number) => Promise<void>;
    userHasVoted: boolean;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({
    pollId,
    choiceId,
    isActiveChoice,
    handleVote,
    userHasVoted,
}) => {
    const [voteCount, setVoteCount] = useState<number>(0); // State to store vote count
    const [isVoting, setIsVoting] = useState<boolean>(false); // State to track voting status

    useEffect(() => {
        // Subscribe to real-time updates for the vote count
        const choiceRef: DocumentReference = doc(firestore, 'polls', pollId, 'choices', choiceId);

        const unsubscribe = onSnapshot(choiceRef, (snapshot) => {
            if (snapshot.exists()) {
                const choiceData = snapshot.data();
                const votes = choiceData.choiceVotes ? choiceData.choiceVotes.length : 0;
                setVoteCount(votes);
            }
        });

        return () => {
            unsubscribe(); // Unsubscribe from real-time updates when component unmounts
        };
    }, [pollId, choiceId]);

    const handleVoteClick = async (increment: number) => {
        if (isVoting) return; // Prevent multiple clicks during voting

        setIsVoting(true); // Set to true when vote button is clicked

        try {
            // Fetch the current vote count for the poll from your data source (e.g., Firestore)
            const currentVoteCount = await getCurrentVoteCountForPoll(pollId);

            // Calculate the new vote count based on the increment value
            const newVoteCount = currentVoteCount + increment;

            // Update the vote count in your data source (e.g., Firestore) with the newVoteCount
            await updateVotes(pollId, newVoteCount);
        } catch (error) {
            console.error('Error handling vote:', error);
        } finally {
            setIsVoting(false); // Reset to false after handling vote
        }
    };

    return (
        <div className={`${styles['vote-buttons']} border border-gray-900/10`}>
            <div className={`${styles['vote-buttons__buttons']} rounded-s-md`}>
                <button
                    className={'border-b border-gray-900/10 w-7 h-7 grid'}
                    onClick={() => handleVoteClick(1)}
                    disabled={
                        userHasVoted ||
                        (isActiveChoice !== null && choiceId !== isActiveChoice) ||
                        isVoting
                    }
                >
                    <IonIcon icon={chevronUpOutline}></IonIcon>
                </button>
                <button
                    className={'w-7 h-7 grid'}
                    onClick={() => handleVoteClick(-1)}
                    disabled={!userHasVoted || isVoting}
                >
                    <IonIcon icon={chevronDownOutline}></IonIcon>
                </button>
            </div>
            <div className={`${styles['vote-buttons__votes']} w-fit`}>{voteCount}</div>
        </div>
    );
};

export default VoteButtons;
