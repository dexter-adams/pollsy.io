import './Login.css';

import {IonContent, IonIcon, IonPage, IonTabButton} from '@ionic/react';
import LoginForm from '../components/LoginForm';
import {IonButton} from '@ionic/react';
import {closeOutline} from "ionicons/icons";

const Login: React.FC = () => {
    return (
        <>
            <IonPage id="main-content">
                <IonContent fullscreen>
                    {/* Use a regular HTML button with onClick */}
                    <IonButton fill="clear" routerLink="/" routerDirection="back">
                        <IonIcon icon={closeOutline}/>
                    </IonButton>

                    <div className="p-5">
                        <LoginForm/>
                    </div>
                </IonContent>
            </IonPage>
        </>
    );
};

export default Login;
