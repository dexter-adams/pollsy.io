import styles from './UserProfile.module.css';

import React, {useState} from 'react';
import {User} from 'firebase/auth';
import {useAuth} from '../../providers/AuthProvider';
import {checkUsernameAvailability, updateUserDoc} from '../../helpers/userHelpers';
import UserProfilePhotoUploader from '../UserProfilePhotoUploader';
import UserProfileRows from '../UserProfileRows';
import {auth} from '../../config/firebase';
import {updateEmail, sendEmailVerification} from 'firebase/auth';

interface UserProfileProps {
    user: User | null;
}

const UserProfile: React.FC<UserProfileProps> = ({user}) => {
    const [displayName, setDisplayName] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [usernameError, setUsernameError] = useState<string>('');
    const [emailChangeRequested, setEmailChangeRequested] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleUsernameChange = async (value: string) => {
        checkUsernameAvailability(value)
            .then(() => {
                updateUserDoc(user, {username: value})
                    .then(() => {
                        setUsername(value);
                    })
                    .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error));
    };

    const handleDisplayNameChange = async (value: string) => {
        updateUserDoc(user, {email: value})
            .then(() => {
                setDisplayName(value);
            })
            .catch((error) => console.log(error));
    };

    const handleEmailChange = async (newEmail: string) => {
        const currentUser = auth.currentUser;

        if (currentUser) {
            try {
                await updateEmail(currentUser, newEmail);
                await sendEmailVerification(currentUser);

                // Display a success message to the user
                console.log('Email change initiated. Verification link sent.');
            } catch (error: any) {
                console.error(error.message);
                setError(error.message);
            }
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Handle file change
    };

    const onFileUpload = async () => {
        // Handle file upload
    };

    const onDeletePhoto = async () => {
        // Handle photo deletion
    };

    const userProfileRows = [
        {
            fieldTitle: 'Username',
            fieldLabel: 'Add username',
            fieldName: 'username',
            fieldPlaceholder: 'Enter username.',
            onChange: (value: string) => setUsername(value),
            onClick: () => handleUsernameChange(username),
            error: usernameError,
        },
        {
            fieldTitle: 'Display Name',
            fieldLabel: 'Add display name',
            fieldName: 'displayName',
            fieldPlaceholder: 'Enter display name.',
            onChange: (value: string) => setDisplayName(value),
            onClick: () => handleDisplayNameChange(displayName),
            error: '',
        },
        {
            fieldTitle: 'Email',
            fieldLabel: 'Update email',
            fieldName: 'email',
            fieldPlaceholder: 'Enter new email',
            onChange: (value: string) => setUserEmail(value),
            onClick: () => handleEmailChange(userEmail),
            error: '',
            success: 'A confirmation link has been sent to your new email address. Please check your email to confirm the change.',
            showSuccess: emailChangeRequested,
        },
    ];

    return (
        <>
            <div className="flex flex-col gap-3 bg-gray-900/10 mb-[80px]">
                <UserProfilePhotoUploader
                    className="w-1/2 m-auto -mb-[80px]"
                    user={user}
                    onChange={onFileChange}
                    onFileUpload={onFileUpload}
                    onDeletePhoto={onDeletePhoto}/>
            </div>
            {user && <UserProfileRows user={user} rows={userProfileRows}/>}
        </>
    );
};

export default UserProfile;
