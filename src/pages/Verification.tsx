import './Verification.css';
import { IonContent, IonPage } from '@ionic/react';
import PageHeader from "../components/PageHeader";
import Header from "../components/Header";
import { useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import { firestore } from "../config/firestore";
import Button from "../components/Button";
import LinkButton from "../components/LinkButton";

const Verification: React.FC = () => {
    const { user } = useAuth(); // Get the user from your AuthProvider

    useEffect(() => {
        const onEmailVerificationSuccess = async (user: { uid: string; }) => {
            // Retrieve the user's Firestore document
            const userDocRef = doc(firestore, 'users', user.uid);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                // User document already exists, no need to add again
                console.log('User document already exists:', userDocSnapshot.data());
            } else {
                // Check if the 'users' collection exists, and create it if not
                const usersCollectionRef = collection(firestore, 'users');
                await addDoc(usersCollectionRef, {}); // Add an empty document to create the collection

                // Add the userDoc with additional information
                await setDoc(userDocRef, {
                    displayName: 'New User',
                    username: '', // Add an empty field for username
                });
                console.log('User document added to Firestore');
            }
        };

        if (user && user.emailVerified) {
            // Call the success function after email verification
            onEmailVerificationSuccess(user);
        }
    }, [user]);

    return (
        <>
            <IonPage id="main-content">
                <IonContent fullscreen>
                    <div className="p-5">
                        Email successfully verified. Let's get pollin'!
                        <LinkButton full href="/">View Polls</LinkButton>
                    </div>
                </IonContent>
            </IonPage>
        </>
    );
};

export default Verification;
