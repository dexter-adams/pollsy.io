import './Profile.css';

import UserProfile from '../components/UserProfile';
import {forwardRef} from "react";
import {useAuth} from "../providers/AuthProvider";
import ThemeWrapper from "../components/ThemeWrapper/ThemeWrapper";
import {IonButton, IonContent, IonIcon, IonPage} from "@ionic/react";
import {closeOutline} from "ionicons/icons";

const Profile = forwardRef((props, ref) => {
    const {user} = useAuth();

    return (
        <ThemeWrapper>
            <IonPage id="main-content">
                <IonContent>
                    <IonButton fill="clear" routerLink="/account" routerDirection="back">
                        <IonIcon icon={closeOutline}/>
                    </IonButton>
                    <div className="py-5">
                        <UserProfile user={user}/>
                    </div>
                </IonContent>
            </IonPage>
        </ThemeWrapper>
    );
});

export default Profile;
