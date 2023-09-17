import React from 'react';
import styles from './Choice.module.css';
import VoteButtons from '../VoteButtons';
import {IonProgressBar} from "@ionic/react";

interface ChoiceProps {
    className?: string;
    pollId: string;
    choice: {
        id: string;
        choiceText: string | undefined;
        choiceVotes?: string[]; // Assuming choiceVotes is an array of user IDs
    };
    isActiveChoice: string | null;
    handleVote: (choiceId: string, increment: number) => Promise<void>;
    userHasVoted: boolean;
    totalVotes: number;
    voteCount: number; // Add this property
}

const Choice: React.FC<ChoiceProps> = ({
    className = '',
    pollId,
    choice,
    isActiveChoice,
    handleVote,
    userHasVoted,
    totalVotes,
    voteCount
}) => {
    const percentage = (totalVotes > 0) ? (voteCount ? (voteCount / totalVotes) * 100 : 0) : 0;

    return (
        <>
            <div className={`${className} ${styles['choice']}`}>
                <div className={styles['choice__text']}>{choice.choiceText}</div>
                <VoteButtons
                    pollId={pollId}
                    choiceId={choice.id}
                    isActiveChoice={isActiveChoice}
                    handleVote={handleVote}
                    userHasVoted={userHasVoted}
                />
                <div className={styles['percentage-bar']}>
                    <IonProgressBar value={percentage}></IonProgressBar>
                </div>
            </div>
        </>
    );
};

export default Choice;
