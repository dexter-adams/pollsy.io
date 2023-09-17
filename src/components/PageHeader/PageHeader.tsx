import {IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar} from "@ionic/react";

interface PageHeaderProps {
    title?: string;
}

const PageHeader = ({
                        title = ''
                    }) => {
    return (
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonMenuButton></IonMenuButton>
                </IonButtons>
                <IonTitle>{title}</IonTitle>
            </IonToolbar>
        </IonHeader>
    )
}

export default PageHeader;