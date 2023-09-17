import styles from './SinglePollPage.module.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {doc, onSnapshot, collection, query, where, addDoc, getDocs, getDoc, deleteDoc} from 'firebase/firestore';
import { firestore } from '../../config/firestore';
import ChoiceForm from '../ChoiceForm';
import { useAuth } from '../../providers/AuthProvider';
import PollQuestion from '../PollQuestion';
import LeadingChoice from '../LeadingChoice';
import Choice from '../Choice';
import { getPollChoices, getLeadingPollChoice, handleVoteAdd, handleVoteRemove } from '../../helpers/voteHelpers';
import { incrementViewCount } from '../../helpers/engagementHelpers';
import LinkButton from '../LinkButton';
import {useHistory} from "react-router";

interface PollChoice {
    id: string;
    choiceText: string;
    choiceVotes: any[];
}

interface PollData {
    author: any;
    question: string;
    // Add other properties as needed
}

const SinglePollPage: React.FC = () => {
    const { user } = useAuth();
    const { id } = useParams<{ id: string }>();
    const history = useHistory();

    // State variables
    const [poll, setPoll] = useState<PollData | null>(null);
    const [activeChoice, setActiveChoice] = useState<string | null>(null);
    const [userVotes, setUserVotes] = useState<Record<string, boolean>>({});
    const [choices, setChoices] = useState<PollChoice[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [totalVotes, setTotalVotes] = useState<number>(0);
    const [leadingChoice, setLeadingChoice] = useState<{
        choiceText: string;
        choiceVotes: [];
    } | undefined>(undefined);
    const [choiceVoteCounts, setChoiceVoteCounts] = useState<Record<string, number>>(
        {}
    );

    // Handle vote logic
    const handleVote = async (choiceId: string, increment: number) => {
        if (!currentUserId) {
            return;
        }

        const choiceRef = doc(firestore, 'polls', id, 'choices', choiceId);

        try {
            const choiceDoc = await getDoc(choiceRef);

            if (choiceDoc.exists()) {
                const choiceDocData = choiceDoc.data();
                const choiceVotes = choiceDocData.choiceVotes || [];
                const isActiveChoice = choiceVotes.some((vote: { userId: string }) => vote.userId === currentUserId);

                if (!isActiveChoice) {
                    if (increment > 0) {
                        await handleVoteAdd(choiceRef, choiceVotes, currentUserId, id, choiceId, choices);
                        setUserVotes((prevUserVotes) => ({ ...prevUserVotes, [choiceId]: true }));
                        setActiveChoice(choiceId);
                        setTotalVotes((prevTotalVotes) => prevTotalVotes + 1);

                        // Update the vote count for the choice after a successful vote
                        setChoiceVoteCounts((prevCounts) => ({
                            ...prevCounts,
                            [choiceId]: (prevCounts[choiceId] || 0) + 1,
                        }));
                    }
                } else if (isActiveChoice && choiceId === activeChoice) {
                    if (increment < 0) {
                        await handleVoteRemove(choiceRef, choiceVotes, currentUserId, id, activeChoice, choices);
                        setUserVotes((prevUserVotes) => ({ ...prevUserVotes, [choiceId]: false }));
                        setActiveChoice(null);
                        setTotalVotes((prevTotalVotes) => prevTotalVotes - 1);

                        // Update the vote count for the choice after a successful vote removal
                        setChoiceVoteCounts((prevCounts) => ({
                            ...prevCounts,
                            [choiceId]: (prevCounts[choiceId] || 0) - 1,
                        }));
                    }
                }
            }

            // After handling the vote, update the choices and leading choice
            const updatedChoicesData = await getPollChoices(id);
            setChoices(updatedChoicesData);

            const leading = await getLeadingPollChoice(updatedChoicesData);
            if (leading !== undefined) {
                const formattedLeadingChoice = {
                    choiceText: leading.choiceText,
                    choiceVotes: [] as [], // You can update this as needed
                };
                setLeadingChoice(formattedLeadingChoice);
            }
        } catch (error) {
            console.error('Error handling vote:', error);
        }
    };

    // Function to increment view count and record user view
    const incrementViewAndRecord = async () => {
        if (!currentUserId) {
            return;
        }

        // Check if the user has viewed this poll before
        const viewsCollectionRef = collection(firestore, 'views');
        const userPollViewQuery = query(
            viewsCollectionRef,
            where('userId', '==', currentUserId),
            where('pollId', '==', id)
        );

        const userPollViewsSnapshot = await getDocs(userPollViewQuery);

        if (userPollViewsSnapshot.empty) {
            // The user has not viewed this poll before
            // Increment the view count
            await incrementViewCount(id);

            // Record the user's view
            await addDoc(viewsCollectionRef, {
                userId: currentUserId,
                pollId: id,
                timestamp: new Date(),
            });
        }
    };

    // Function to delete a poll
    const deletePoll = async () => {
        if (!id) {
            return;
        }

        if (user && user.uid) {
            // Check if the current user is the author of the poll
            const pollRef = doc(firestore, 'polls', id);
            const pollDoc = await getDoc(pollRef);

            if (pollDoc.exists()) {
                const pollData = pollDoc.data();
                const authorId = pollData.author;

                if (user.uid === authorId) {
                    // Prompt for confirmation
                    const confirmation = window.prompt('To confirm deletion, type "yes"');
                    if (confirmation === 'yes') {
                        // Delete the poll and navigate back
                        await deleteDoc(pollRef);
                        history.push('/'); // Redirect to the home page or any desired page
                    } else {
                        // User did not confirm
                        return;
                    }
                } else {
                    // User is not the author, cannot delete
                    alert('You do not have permission to delete this poll.');
                }
            }
        }
    };

    // Fetch user data and poll data on mount
    useEffect(() => {
        if (user.uid) {
            setCurrentUserId(user.uid);
        }
    }, [user]);

    useEffect(() => {
        if (id) {
            const pollRef = doc(firestore, 'polls', id);

            onSnapshot(pollRef, (snapshot) => {
                if (snapshot.exists()) {
                    setPoll(snapshot.data() as PollData);
                }
            });
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            const fetchChoices = async () => {
                try {
                    const choicesData = await getPollChoices(id);
                    setChoices(choicesData);
                } catch (error) {
                    console.error(error);
                }
            };

            fetchChoices();
        }
    }, [id]);

    // Handle user votes and calculate total votes
    useEffect(() => {
        const initialVoteCounts: Record<string, number> = {};

        choices.forEach((choice) => {
            initialVoteCounts[choice.id] = choice.choiceVotes ? choice.choiceVotes.length : 0;
        });
    }, [choices]);

    useEffect(() => {
        if (choices.length > 0) {
            const userVotes: Record<string, boolean> = {};

            for (const choice of choices) {
                const userHasVoted = choice.choiceVotes
                    ? choice.choiceVotes.some((vote) => {
                        return vote.userId === currentUserId;
                    })
                    : false;

                userVotes[choice.id] = userHasVoted;

                if (userHasVoted) {
                    setActiveChoice(choice.id);
                    break;
                }
            }

            setUserVotes(userVotes);
        }
    }, [choices, currentUserId]);

    useEffect(() => {
        if (choices.length > 0) {
            const calculatedTotalVotes = choices.reduce(
                (total, choice) => total + (choice.choiceVotes ? choice.choiceVotes.length : 0),
                0
            );
            setTotalVotes(calculatedTotalVotes);
        }
    }, [choices]);

    // Fetch poll data and leading choice on mount
    useEffect(() => {
        if (id) {
            const pollRef = doc(firestore, 'polls', id);

            onSnapshot(pollRef, async (snapshot) => {
                if (snapshot.exists()) {
                    setPoll(snapshot.data() as PollData);
                    const leading = await getLeadingPollChoice(choices);

                    if (leading !== undefined) {
                        const formattedLeadingChoice = {
                            choiceText: leading.choiceText,
                            choiceVotes: [] as [],
                        };
                        setLeadingChoice(formattedLeadingChoice);
                    }
                }
            });

            // Increment view count and record user view
            incrementViewAndRecord();
        }
    }, [id, choices, currentUserId]);

    return (
        <>
            {poll && (
                <>
                    <header className={styles['poll-header']}>
                        <PollQuestion question={poll.question} />
                        {choices.length === 0 ? (
                            <p className="text-center">Waiting on choices for this poll</p>
                        ) : (
                            <LeadingChoice leadingChoice={leadingChoice} />
                        )}
                    </header>
                    <div className={styles['choices']}>
                        {choices &&
                            choices.map((choice) => (
                                <Choice
                                    key={choice.id}
                                    pollId={id}
                                    choice={{
                                        id: choice.id,
                                        choiceText: choice.choiceText,
                                        choiceVotes: choice.choiceVotes,
                                    }}
                                    isActiveChoice={activeChoice}
                                    handleVote={handleVote}
                                    userHasVoted={userVotes[choice.id]}
                                    totalVotes={totalVotes}
                                    // Pass the vote count for each choice to the Choice component
                                    voteCount={choiceVoteCounts[choice.id] || 0}
                                />
                            ))}
                    </div>
                    {user ? (
                        <>
                            <ChoiceForm id={id} />
                            {user.uid === poll.author && (
                                <button onClick={deletePoll} className="btn btn-danger">
                                    Delete Poll
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="p-4">
                            <LinkButton href="/login" variant="primary" full={true}>
                                Login to Vote
                            </LinkButton>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default SinglePollPage;
