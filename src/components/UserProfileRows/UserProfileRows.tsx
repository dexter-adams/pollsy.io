import styles from './UserProfileRows.module.scss';

import React, {useState} from 'react';
import {
    IonCard,
    IonCardContent,
    IonText,
    IonList,
    IonInput,
    IonItem, IonLabel,
} from '@ionic/react';

import Button from "../Button";

interface UserProfileRow {
    fieldTitle: string;
    fieldLabel: string;
    fieldName: string;
    fieldPlaceholder: string;
    onChange: (value: string) => void;
    onClick: () => void;
    error: string;
    success?: string;
    showSuccess?: boolean;
}

interface UserProfileRowsProps {
    user: Record<string, any>;
    rows: UserProfileRow[];
}

const UserProfileRows: React.FC<UserProfileRowsProps> = ({user, rows}) => {
    // Initialize isOpen state for each profile row
    const [isOpenStates, setIsOpenStates] = useState<boolean[]>(
        new Array(rows.length).fill(false)
    );

    // Function to toggle the open state of a specific row
    const toggleRowOpen = (rowIndex: number) => {
        setIsOpenStates((prevStates) => {
            const updatedStates = [...prevStates];
            updatedStates[rowIndex] = !updatedStates[rowIndex];
            return updatedStates;
        });
    };

    return (
        <IonList>
            <IonItem>
                <IonLabel position="stacked">UID:</IonLabel>
                <IonInput value={user.uid} disabled></IonInput>
            </IonItem>

            {rows.map((row, index) => (
                <IonCard key={index}>
                    <IonCardContent className="profile-row">
                        {user[row.fieldName] && (
                            <div className={`${styles["profile-row__item"]} ${styles["profile-row__item--primary"]} border-b border-white/10 pb-5 mb-5`}>
                                {/* Remove IonLabel for fieldTitle */}
                                <IonText>{user[row.fieldName]}</IonText>
                            </div>
                        )}

                        <div className={`${styles["profile-row__item"]} ${styles["profile-row__item--edit"]}`}>
                            {/* Remove IonLabel for fieldLabel */}
                            <IonInput
                                placeholder={row.fieldPlaceholder} // Use placeholder directly
                                onIonChange={(e) => row?.onChange(e.detail.value!)}
                            />
                            {row.showSuccess && row.success ? (
                                <IonText>{row.success}</IonText>
                            ) : (
                                <Button size="small" full onClick={row.onClick}>
                                    Update
                                </Button>
                            )}
                            {row.error && <IonText color="danger">{row.error}</IonText>}
                        </div>
                    </IonCardContent>
                </IonCard>
            ))}
        </IonList>
    );
};

export default UserProfileRows;
