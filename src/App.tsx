/* App CSS */
import './App.css';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import {AuthProvider} from "./providers/AuthProvider";
import {SessionProvider} from "./providers/SessionProvider";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

import {Route} from 'react-router-dom';
import {IonApp, IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';

import Login from "./pages/Login";
import Register from "./pages/Register";

import Home from './pages/Home';
import Poll from './pages/Poll';
import Account from './pages/Account';
import Profile from './pages/Profile';
import CreatePoll from './pages/Create';
import {ThemeProvider} from "./providers/ThemeProvider";
import Verification from "./pages/Verification";
import Trending from "./pages/Trending";
import {createOutline, flameOutline, homeOutline, personOutline} from "ionicons/icons";

setupIonicReact();

const App: React.FC = () => {
    const routes = [
        {path: '/', component: Home},
        {path: '/account', component: Account, protected: true},
        {path: '/login', component: Login},
        {path: '/register', component: Register},
        {path: '/profile', component: Profile, protected: true},
        {path: '/create-poll', component: CreatePoll, protected: true},
        {path: '/poll/:id', component: Poll},
        {path: '/email-verification', component: Verification},
        {path: '/trending', component: Trending},
    ];

    return (
        <IonApp>
            <ThemeProvider>
                <SessionProvider>
                    <AuthProvider>
                        <IonReactRouter>
                            <IonTabs>
                                <IonRouterOutlet>
                                    {routes.map((route, key) => (
                                        <Route exact key={key} path={route.path}>
                                            {route.protected ? (
                                                <PrivateRoute>
                                                    <route.component/>
                                                </PrivateRoute>
                                            ) : (
                                                <route.component/>
                                            )}
                                        </Route>
                                    ))}
                                </IonRouterOutlet>

                                <IonTabBar slot="bottom">
                                    <IonTabButton tab="home" href="/">
                                        <IonIcon icon={homeOutline} size="large" color="primary"/>
                                    </IonTabButton>
                                    <IonTabButton tab="create-poll" href="/create-poll">
                                        <IonIcon icon={createOutline} size="large" color="primary"/>
                                    </IonTabButton>
                                    <IonTabButton tab="trending" href="/trending">
                                        <IonIcon icon={flameOutline} size="large" color="primary"/>
                                    </IonTabButton>
                                    <IonTabButton tab="account" href="/account">
                                        <IonIcon icon={personOutline} size="large" color="primary"/>
                                    </IonTabButton>
                                </IonTabBar>
                            </IonTabs>
                        </IonReactRouter>
                    </AuthProvider>
                </SessionProvider>
            </ThemeProvider>
        </IonApp>
    )
};

export default App;
