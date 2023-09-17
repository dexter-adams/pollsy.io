import React from 'react';

import styles from './LeadingChoice.module.css';

interface LeadingChoiceProps {
    leadingChoice: { choiceText: string; choiceVotes: [] } | undefined;
}

const LeadingChoice: React.FC<LeadingChoiceProps> = ({leadingChoice}) => {
    console.log(leadingChoice);
    return leadingChoice ? (
        <div className={styles['leading-choice']}>
            Leading Choice: {leadingChoice.choiceText} (Votes: {leadingChoice.choiceVotes.length})
        </div>
    ) : (
        <div className={styles['leading-choice']}>Waiting for voters...</div>
    );
};

export default LeadingChoice;
