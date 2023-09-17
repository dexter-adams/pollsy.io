import styles from './PollsList.module.css';
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {getPolls} from '../../helpers/pollsHelpers';
import {getVotersPhotos} from '../../helpers/userHelpers';
import {calculateTotalVotes} from '../../helpers/voteHelpers';
import VoterPhoto from '../VoterPhoto';

interface Poll {
    id: string;
    author: string;
    question: string;
    createdAt: string;
}

interface UserData {
    id: string;
    name: string;
    photoURL: string;
    // Add other properties as needed
}

interface TotalVotesData {
    [pollId: string]: number | undefined;
}

interface VoterData {
    [pollId: string]: UserData[];
}

const PollsList: React.FC = () => {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [voterData, setVoterData] = useState<VoterData>({});
    const [totalVotesData, setTotalVotesData] = useState<TotalVotesData>({});

    useEffect(() => {
        // Check if poll data is already cached in state
        if (polls.length === 0) {
            const fetchPollsData = async () => {
                try {
                    const pollsData = await getPolls();
                    setPolls(pollsData);

                    // Fetch and cache voter data and total votes data
                    const totalVotesPromises = pollsData.map((poll) => calculateTotalVotes(poll.id));
                    const voterDataPromises = pollsData.map((poll) => getVotersPhotos(poll.id));

                    Promise.all(totalVotesPromises)
                        .then((totalVotesResults) => {
                            const totalVotes: TotalVotesData = {};
                            pollsData.forEach((poll, index) => {
                                totalVotes[poll.id] = totalVotesResults[index];
                            });
                            setTotalVotesData(totalVotes);
                        })
                        .catch((error) => {
                            console.error('Error fetching total votes data:', error);
                        });

                    Promise.all(voterDataPromises)
                        .then((voterDataResults) => {
                            const voters: VoterData = {};
                            pollsData.forEach((poll, index) => {
                                // Map the voter data to the UserData interface
                                voters[poll.id] = voterDataResults[index].map((voter: any) => ({
                                    id: voter.userDocId,
                                    name: voter.name, // Replace with the actual property containing the user's name
                                    photoURL: voter.photoURL
                                    // Add other properties as needed
                                }));
                            });
                            setVoterData(voters);
                        })
                        .catch((error) => {
                            console.error('Error fetching voter data:', error);
                        });
                } catch (error) {
                    console.error('Error fetching poll data:', error);
                }
            };

            fetchPollsData();
        }
    }, [polls]);

    return (
        <div className={styles['poll-cards']}>
            {polls.length === 0 ? (
                <div className={`${styles['no-polls-message']} m-4 h-full flex flex-col justify-center`}>
                    No one has created anything yet.
                </div>
            ) : (
                polls.map((poll) => {
                    const votersForPoll = voterData[poll.id] || []; // Default to an empty array if no voter data is available

                    return (
                        <div className={styles['poll-card']} key={poll.id}>
                            <div className={styles['poll-card__question']}>
                                <Link to={`/poll/${poll.id}`}>{poll.question}</Link>
                            </div>
                            <div className="flex gap-3">
                                {votersForPoll.length > 0 && (
                                    <div className={styles['poll-card__voter-photos']}>
                                        {votersForPoll.slice(0, 4).map((userData: UserData, index: number) => (
                                            <VoterPhoto key={`${poll.id}_${index}`} userData={userData}/>
                                        ))}
                                    </div>
                                )}
                                <div>
                                    Total Votes: {totalVotesData[poll.id] || 0}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default PollsList;
