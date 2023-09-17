import './Create.css';

import PollForm from '../components/PollForm';
import {forwardRef} from "react";
import Header from "../components/Header";
import PageHeader from "../components/PageHeader";
import {IonButton, IonContent, IonIcon, IonPage} from "@ionic/react";
import {closeOutline} from "ionicons/icons";

const Create = forwardRef((props, ref) => {
    return (
        <>
            <IonPage id="main-content">
                <IonContent fullscreen>
                    <IonButton fill="clear" routerLink="/" routerDirection="back">
                        <IonIcon icon={closeOutline}/>
                    </IonButton>
                    <PollForm/>
                </IonContent>
            </IonPage>
        </>
    );
});

export default Create;
