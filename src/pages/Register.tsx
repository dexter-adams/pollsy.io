import './Register.css';

import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import RegistrationForm from "../components/RegistrationForm";
import Header from "../components/Header";
import PageHeader from "../components/PageHeader";

const Register: React.FC = () => {
    return (
        <>
            <IonPage id="main-content">
                <IonContent fullscreen>
                    <div className="py-8 px-5">
                        <RegistrationForm/>
                    </div>
                </IonContent>
            </IonPage>
        </>
    );
};

export default Register;
