import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Keys for Local Storage
const BADGES_KEY = "mituki_badges_data"; // Store array of badges
const LAST_BADGE_NUMBER_KEY = "mituki_last_badge_number";
const MAX_BADGES_PER_DEVICE = 5;
const STARTING_BADGE_NUMBER = 2520;

const PhotoCapturePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { name } = location.state || { name: '' }; // Get name passed from RegisterPage

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);

    // Start camera
    const startCamera = useCallback(async () => {
        setError(null);
        setPhotoDataUrl(null); // Clear previous photo
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            if (err instanceof Error) {
                if (err.name === 'NotAllowedError') {
                    setError('Camera access was denied. Please allow camera access in your browser settings.');
                } else if (err.name === 'NotFoundError') {
                    setError('No camera found on this device.');
                } else {
                    setError(`Error accessing camera: ${err.message}`);
                }
            } else {
                setError('An unknown error occurred while accessing the camera.');
            }
        }
    }, []);

    // Stop camera
    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        }
    }, [stream]);

    // Start camera on mount
    useEffect(() => {
        if (!name) {
            // If name is missing (e.g., direct navigation), redirect
            navigate('/register');
            return;
        }
        startCamera();
        // Stop camera on unmount
        return () => {
            stopCamera();
        };
    }, [startCamera, stopCamera, name, navigate]);

    // Capture photo
    const capturePhoto = useCallback(() => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                // Set canvas dimensions to match video stream
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                // Draw the current video frame onto the canvas
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Get the image data URL (e.g., PNG format)
                const dataUrl = canvas.toDataURL('image/png');
                setPhotoDataUrl(dataUrl);
                stopCamera(); // Stop camera after capture
            }
        }
    }, [stopCamera]);

    // Finalize registration
    const handleFinalize = () => {
        if (!photoDataUrl) {
            setError("Please capture a photo first.");
            return;
        }
        if (!name) {
             setError("User name is missing. Please go back.");
             return;
        }

        try {
            // Get existing badges or initialize
            const existingBadgesStr = localStorage.getItem(BADGES_KEY);
            let badges: any[] = existingBadgesStr ? JSON.parse(existingBadgesStr) : [];

            // Check badge limit
            if (badges.length >= MAX_BADGES_PER_DEVICE) {
                setError(`Cannot generate more than ${MAX_BADGES_PER_DEVICE} badges on this device.`);
                // Optionally redirect or show a specific message
                // navigate('/limit-reached'); 
                return;
            }

            // Get the last assigned number or start from the beginning
            let lastNumberStr = localStorage.getItem(LAST_BADGE_NUMBER_KEY);
            let nextNumber = STARTING_BADGE_NUMBER;
            if (lastNumberStr) {
                nextNumber = parseInt(lastNumberStr, 10) + 1;
            }

            // Create new badge data
            const newBadge = {
                name: name,
                badgeNumber: nextNumber,
                badgeId: `GR${nextNumber}`, // Add GR prefix
                photoDataUrl: photoDataUrl,
                timestamp: new Date().toISOString()
            };

            // Add new badge and update storage
            badges.push(newBadge);
            localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
            localStorage.setItem(LAST_BADGE_NUMBER_KEY, nextNumber.toString());
            
            // We don't need the single registration status key anymore
            // localStorage.setItem(REGISTRATION_STATUS_KEY, 'registered');
            
            // Clear the session flag allowing registration steps
            sessionStorage.removeItem("mituki_can_register");

            // Navigate to the badge page (pass the new badge ID or index?)
            // For simplicity, navigate to the generic badge page which will show the latest
            navigate('/badge'); 

        } catch (storageError) {
            console.error("Error saving badge data:", storageError);
            setError("Failed to save badge data. Local storage might be full or disabled.");
        }
    };

    return (
        <div className="p-4 text-center">
            <h2 className="text-2xl font-semibold mb-6">Capture Your Photo, {name}</h2>
            <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                {error && <p className="text-red-500 mb-4">Error: {error}</p>}

                {!photoDataUrl ? (
                    <>
                        <div className="relative mb-4 bg-black rounded overflow-hidden border border-gray-600">
                            <video ref={videoRef} autoPlay playsInline className="w-full h-auto" style={{ transform: 'scaleX(-1)' }}></video>
                            {/* Hidden canvas for capturing frame */}
                            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                        </div>
                        {stream && (
                            <button
                                onClick={capturePhoto}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition duration-300 ease-in-out mb-2"
                            >
                                Take Photo
                            </button>
                        )}
                        {!stream && !error && <p className="text-gray-400">Starting camera...</p>}
                    </>
                ) : (
                    <>
                        <p className="text-green-400 mb-2">Photo Captured!</p>
                        <img src={photoDataUrl} alt="Captured photo" className="mb-4 rounded border border-gray-500 max-w-full h-auto mx-auto" />
                        <button
                            onClick={startCamera} // Retake photo
                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-3 px-4 rounded transition duration-300 ease-in-out mb-2"
                        >
                            Retake Photo
                        </button>
                        <button
                            onClick={handleFinalize}
                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded transition duration-300 ease-in-out"
                        >
                            Confirm & Get My Badge (GR{localStorage.getItem(LAST_BADGE_NUMBER_KEY) ? parseInt(localStorage.getItem(LAST_BADGE_NUMBER_KEY)!, 10) + 1 : STARTING_BADGE_NUMBER})
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PhotoCapturePage;

