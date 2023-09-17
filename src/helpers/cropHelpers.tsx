import { loadImage } from 'canvas';

// Define a function to get the cropped image as a Blob
export const getCroppedImg = async (imageFile: File, croppedAreaPixels: any): Promise<Blob> => {
    const image = new Image(); // Create an HTMLImageElement
    image.src = URL.createObjectURL(imageFile); // Set the image source

    const canvas = document.createElement('canvas');

    if (!canvas) {
        throw new Error('Canvas not supported.');
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Canvas 2d context not supported.');
    }

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    // Ensure the image is fully loaded before drawing
    await new Promise<HTMLImageElement>((resolve) => {
        image.onload = () => {
            resolve(image);
        };
    });

    ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Error creating blob for cropped image.'));
                return;
            }
            resolve(blob);
        }, 'image/jpeg'); // You can change the format here (e.g., 'image/png')
    });
};
