import React, {useState} from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {collection, doc, getDoc, serverTimestamp, writeBatch} from 'firebase/firestore';
import {firestore} from '../../config/firestore';
import Button from '../Button';
import {useAuth} from '../../providers/AuthProvider';
import LinkButton from '../LinkButton';

interface PollFormValues {
    question: string;
}

const PollForm: React.FC = () => {
    const {user: currentUser} = useAuth();

    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [successMessageVisible, setSuccessMessageVisible] = useState<boolean>(false);
    const [newPollId, setNewPollId] = useState<string | null>(null);

    const initialValues: PollFormValues = {
        question: '',
    };

    const validationSchema = Yup.object().shape({
        question: Yup.string().required('Question is required'),
    });

    const handleSubmit = async (values: PollFormValues, {setSubmitting}: any) => {
        try {
            const batch = writeBatch(firestore);

            const newPollRef = doc(collection(firestore, 'polls'));
            batch.set(newPollRef, {
                author: currentUser.uid,
                question: values.question,
                createdAt: serverTimestamp(),
            });

            // Add a new document to the engagements collection
            const newEngagementRef = doc(collection(firestore, 'engagements'), newPollRef.id);
            batch.set(newEngagementRef, {
                votes: 0,
                comments: 0,
                shares: 0,
                views: 0,
            });

            const userDocRef = doc(firestore, 'users', currentUser.uid);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                const userData: any = userDocSnapshot.data();
                const createdPolls = userData.createdPolls || [];
                createdPolls.push(newPollRef.id);
                batch.update(userDocRef, {createdPolls});
            } else {
                batch.set(userDocRef, {createdPolls: [newPollRef.id]});
            }

            await batch.commit();

            setNewPollId(newPollRef.id);
            setFormSubmitted(true);
            setSuccessMessageVisible(true);
        } catch (error) {
            console.error('Error submitting poll:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({isSubmitting}: any) => (
                <Form>
                    <div className="flex flex-col h-full gap-3">
                        {successMessageVisible ? (
                            <div className="px-4 py-8">
                                <div className="border border-green text-lg rounded-lg p-7 flex flex-col gap-6">
                                    <h2>Congratulations!</h2>
                                    Your poll question was successfully created and is under moderation.
                                    {newPollId && (
                                        <LinkButton
                                            href={`/poll/${newPollId}`}
                                            variant="primary"
                                            full={true}
                                        >
                                            Let's add some choices.
                                        </LinkButton>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col gap-3 h-full px-4 py-8">
                                    <label className="hidden" htmlFor="question">
                                        Question:
                                    </label>
                                    <Field
                                        className="w-full"
                                        type="text"
                                        id="question"
                                        name="question"
                                        placeholder="Type a question..."
                                        disabled={formSubmitted}
                                    />
                                    <ErrorMessage name="question" component="div" className="error"/>
                                </div>
                                <div className="pollsy-primary-cta">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={formSubmitted || isSubmitting}
                                        full={true}
                                    >
                                        Submit Poll
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default PollForm;
