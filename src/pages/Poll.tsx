import './Poll.css';

import SinglePollPage from '../components/SinglePollPage';
import {forwardRef} from "react";
import Header from "../components/Header";
import {IonContent, IonPage} from "@ionic/react";
import PageHeader from "../components/PageHeader";
import ThemeWrapper from "../components/ThemeWrapper/ThemeWrapper";

const Poll = forwardRef((props, ref) => {
    return (
        <>
            <ThemeWrapper>
                <IonPage id="main-content">
                    <IonContent fullscreen>
                        <div className="py-5">
                            <SinglePollPage/>
                        </div>
                    </IonContent>
                </IonPage>
            </ThemeWrapper>
        </>
    );
});

export default Poll;
