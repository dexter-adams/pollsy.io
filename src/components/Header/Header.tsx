import styles from './Header.module.css';

import {IonContent, IonItem, IonMenu} from "@ionic/react";
import {useAuth} from "../../providers/AuthProvider";
import {useTheme} from "../../providers/ThemeProvider";

const Header = () => {
    const {theme, toggleTheme} = useTheme();
    const {isAuthenticated, logout} = useAuth();

    return (
        <IonMenu contentId="main-content">
            <IonContent className="ion-padding">
                <button onClick={toggleTheme}>Toggle Theme</button>
                <IonItem href="/">Home</IonItem>
                {isAuthenticated && (
                    <>
                        <IonItem href="/profile">Profile</IonItem>
                        <IonItem href="/create-poll">Create Poll</IonItem>

                        <div className={styles['log-out']}>
                            <IonItem href="/" onClick={logout}>Log Out</IonItem>
                        </div>
                    </>
                )}
            </IonContent>
        </IonMenu>
    )
}

export default Header;