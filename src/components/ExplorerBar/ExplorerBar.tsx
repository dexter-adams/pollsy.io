import {IonIcon} from "@ionic/react";
import {createOutline, flameOutline, homeOutline, megaphoneOutline, personOutline} from 'ionicons/icons';
import React from "react";
import {useAuth} from "../../providers/AuthProvider";
import {Link} from "react-router-dom";

const ExplorerBar = () => {
    const {isAuthenticated} = useAuth();

    return (
        <>
            {isAuthenticated && (
                <div className="fixed w-full bottom-0 left-0 right-0 z-[200] px-10 py-7 flex justify-between">
                    <Link to="/"><IonIcon icon={homeOutline} size="large" color="primary"/></Link>
                    <Link to="/create-poll"><IonIcon icon={createOutline} size="large" color="primary"/></Link>
                    <Link to="/trending"><IonIcon icon={flameOutline} size="large" color="primary"/></Link>
                    <Link to="/account"><IonIcon icon={personOutline} size="large" color="primary"/></Link>
                </div>
            )}
        </>
    )
}

export default ExplorerBar;