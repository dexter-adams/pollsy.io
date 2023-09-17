import React, {useState, useCallback, useRef, ChangeEvent} from 'react';
import {fileDelete, fileUpload} from '../../helpers/fileHelpers';
import Cropper from 'react-easy-crop';
import {getCroppedImg} from '../../helpers/cropHelpers'; // Define a function to get the cropped image
import {
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonModal,
    IonRange,
    IonToolbar, RangeChangeEventDetail,
} from '@ionic/react';
import defaultUserThumb from '../../images/default-user.svg';
import classNames from 'classnames';

interface UserProfilePhotoUploaderProps {
    user: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Accepts an event parameter
    onFileUpload: () => void;
    onDeletePhoto: () => void;
    className?: string;
}

const UserProfilePhotoUploader: React.FC<UserProfilePhotoUploaderProps> = ({
                                                                               user,
                                                                               onChange: onFileChange,
                                                                               onFileUpload,
                                                                               onDeletePhoto,
                                                                               className = '',
                                                                           }) => {
    const [selectedFile, setSelectedFile] = useState<File | undefined>();
    const [crop, setCrop] = useState<{ x: number; y: number }>({x: 0, y: 0});
    const [zoom, setZoom] = useState<number>(1);
    const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
    const userPhotoURL = user?.photoURL;

    const handlePlaceholderClick = () => {
        // Trigger file input click programmatically
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Create a ref for the file input element
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
            onFileChange(e);
        }
    };

    const handleFileUpload = async () => {
        if (croppedImage) {
            await fileUpload(user!, 'userPhotos', croppedImage, 'photoURL').then(() => {
                onFileUpload();
            });
        } else {
            console.log('No cropped image was set.');
        }
    };

    const handleDeletePhoto = async () => {
        await fileDelete(user!, userPhotoURL || '').then(() => {
            onDeletePhoto();
        });
    };

    const onCropComplete = useCallback(async (croppedArea: any, croppedAreaPixels: any) => {
        if (selectedFile) {
            const croppedImageBlob = await getCroppedImg(selectedFile, croppedAreaPixels);
            setCroppedImage(croppedImageBlob);
        }
    }, [selectedFile]);

    const [isModalOpen, setIsModalOpen] = useState(false); // Add state for modal visibility

    const classes = classNames('user-profile-photo-uploader', className);

    return (
        <div className={classes}>
            {userPhotoURL ? (
                <div>
                    <img alt="Profile" src={userPhotoURL}/>
                    <button onClick={handleDeletePhoto}>Delete Photo</button>
                </div>
            ) : (
                <div>
                    <div className="placeholder" onClick={handlePlaceholderClick}>
                        <img alt="Add Profile" src={defaultUserThumb}/>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        multiple={false}
                        style={{display: 'none'}}
                        ref={fileInputRef}
                    />
                    {selectedFile && (
                        <div>
                            <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
                                <IonHeader>
                                    <IonToolbar>
                                        <IonButton fill="clear" slot="end" onClick={() => setIsModalOpen(false)}>
                                            <IonIcon name="close"/>
                                        </IonButton>
                                    </IonToolbar>
                                </IonHeader>
                                <IonContent>
                                    <h2>Crop Your Photo</h2>
                                    <div className="crop-container">
                                        <Cropper
                                            image={URL.createObjectURL(selectedFile)}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={1}
                                            onCropChange={setCrop}
                                            onCropComplete={onCropComplete}
                                            onZoomChange={setZoom}
                                        />
                                    </div>
                                    <div className="controls">
                                        <IonRange
                                            min={1}
                                            max={3}
                                            step={0.1}
                                            value={zoom}
                                            onIonChange={(e) => {
                                                const value = e.detail.value as unknown as string;

                                                setZoom(parseFloat(value))
                                            }}
                                        />
                                        <IonButton expand="full" onClick={handleFileUpload}>
                                            Upload Cropped Photo
                                        </IonButton>
                                    </div>
                                </IonContent>
                            </IonModal>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserProfilePhotoUploader;
