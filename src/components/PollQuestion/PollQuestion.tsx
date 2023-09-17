import styles from './PollQuestion.module.css';
import React from 'react';

interface PollQuestionProps {
  question: string;
}

const PollQuestion: React.FC<PollQuestionProps> = ({ question }) => {
  return <h2 className={styles['poll-question']}>{question}</h2>;
};

export default PollQuestion;
