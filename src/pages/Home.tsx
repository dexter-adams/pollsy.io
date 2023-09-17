import './Home.css';

import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import {useAuth} from "../providers/AuthProvider";
import PollsList from "../components/PollsList";
import LinkButton from "../components/LinkButton";
import PageHeader from "../components/PageHeader";
import Header from "../components/Header";

const Home: React.FC = () => {
    const {isAuthenticated} = useAuth();

    return (
        <>
            <IonPage id="main-content">
                <IonContent fullscreen>
                    <div>
                        {isAuthenticated ? (
                            <div className="pollsy-container">
                                <div className="pollsy-full-window">
                                    <PollsList/>
                                </div>
                                <div className="pollsy-primary-cta">
                                    <LinkButton href="/create-poll" variant="primary" full={true}>Create a Poll</LinkButton>
                                </div>
                            </div>
                        ) : (
                            <div className="pollsy-container">
                                <div className="pollsy-full-window grid grid-rows-[auto_1fr]">
                                    <div className="bg-blue/10 p-5">
                                        <h2 className="text-xl">Pollsy</h2>
                                        <h3 className="text-3xl/[1.5] leading-normal">Create, vote, comment</h3>
                                        <p className="">Engage in some of the hottest debate topics on the internet.</p>
                                    </div>
                                    <div className="pt-4">
                                        <PollsList/>
                                    </div>
                                </div>
                                <div className="pollsy-primary-cta">
                                    <LinkButton href="/login" variant="primary" full={true}>Get Started</LinkButton>
                                </div>
                            </div>
                        )}
                    </div>
                </IonContent>
            </IonPage>
        </>
    );
};

export default Home;
