import defaultUserThumb from '../images/default-user.svg';

import React, {forwardRef, useState, useEffect} from "react";
import {IonContent, IonPage, IonList, IonItem, IonLabel, IonButton, IonAvatar} from "@ionic/react";
import PageHeader from "../components/PageHeader";
import Header from "../components/Header";
import {useAuth} from "../providers/AuthProvider";
import fetchUserPolls from "../helpers/userHelpers";
import LinkButton from "../components/LinkButton"; // Assuming you have a TypeScript file

interface Poll {
    id: string;
    question: string;
    // Add other poll properties here
}

const Account = forwardRef<HTMLIonContentElement>((props, ref) => {
    const {user} = useAuth();
    const [userPolls, setUserPolls] = useState<Poll[]>([]);

    useEffect(() => {
        // Replace this with your actual data-fetching function
        fetchUserPolls(user.uid)
            .then((polls: Poll[]) => {
                setUserPolls(polls);
            })
            .catch((error: Error) => {
                console.error("Error fetching user polls:", error);
            });
    }, [user.uid]);

    return (
        <>
            <Header/>
            <IonPage id="main-content">
                <PageHeader title=""/>
                <IonContent fullscreen>
                    <div className="text-center mt-[20px] px-5">
                        <IonAvatar style={{width: "100px", height: "100px", margin: "0 auto"}}>
                            {user.photoURL ? (
                                <img src={user.photoURL} alt="User Thumbnail"/>
                            ) : (
                                <img src={defaultUserThumb} alt="Placeholder"/>
                            )}
                        </IonAvatar>
                        <p>{user.displayName}</p>
                        <LinkButton full href="/profile">
                            Edit Profile
                        </LinkButton>
                    </div>
                    {userPolls.length === 0 ? (
                        <div className="text-center mt-[20px] px-5">
                            <p>You haven't created any polls yet.</p>
                            <LinkButton full href="/create-poll">
                                Create a Poll
                            </LinkButton>
                        </div>
                    ) : (
                        <div className="px-5">
                            <IonList>
                                {userPolls.map((poll) => (
                                    <IonItem key={poll.id}>
                                        <IonLabel>{poll.question}</IonLabel>
                                    </IonItem>
                                ))}
                            </IonList>
                        </div>
                    )}
                </IonContent>
            </IonPage>
        </>
    );
});

export default Account;
