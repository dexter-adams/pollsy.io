import React from 'react';

interface VoterPhotoProps {
    userData: {
        photoURL: string;
    };
}

const VoterPhoto: React.FC<VoterPhotoProps> = ({ userData }) => {
    return (
        <div>
            <img src={userData.photoURL} alt="" />
        </div>
    );
};

export default VoterPhoto;
