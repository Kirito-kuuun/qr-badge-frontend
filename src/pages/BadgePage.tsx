import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';

// Keys for Local Storage
const BADGES_KEY = "mituki_badges_data";

interface BadgeData {
    name: string;
    badgeId: string; // e.g., GR2520
    badgeNumber: number;
    photoDataUrl: string;
    timestamp: string;
}

const BadgePage = () => {
    const [latestBadge, setLatestBadge] = useState<BadgeData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const badgesStr = localStorage.getItem(BADGES_KEY);
            if (badgesStr) {
                const badges: BadgeData[] = JSON.parse(badgesStr);
                if (badges.length > 0) {
                    // Find the badge with the highest badgeNumber (should be the last one added)
                    const sortedBadges = [...badges].sort((a, b) => b.badgeNumber - a.badgeNumber);
                    setLatestBadge(sortedBadges[0]);
                } else {
                    setError("No badge found for this device. Please register first.");
                    // Optional: Redirect to scanner if no badges exist
                    // setTimeout(() => navigate('/scan'), 3000);
                }
            } else {
                setError("No badge found for this device. Please register first.");
                // Optional: Redirect to scanner if no badges exist
                // setTimeout(() => navigate('/scan'), 3000);
            }
        } catch (e) {
            console.error("Error reading badge data from local storage:", e);
            setError("Failed to load badge data. Local storage might be corrupted or inaccessible.");
        }
    }, [navigate]);

    // Data to encode in the badge's QR code
    const qrCodeValue = latestBadge
        ? JSON.stringify({ name: latestBadge.name, badgeId: latestBadge.badgeId })
        : "No badge data";

    return (
        <div className="p-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-cyan-400">Badge grande rencontre 2025</h2>

            {error && (
                <p className="text-red-500 text-lg p-4 bg-gray-800 rounded shadow">{error}</p>
            )}

            {latestBadge && (
                <div className="max-w-sm mx-auto bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl border border-cyan-700/50 relative overflow-hidden">
                    {/* Futuristic decorative elements */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-500 rounded-tl-xl opacity-50"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-500 rounded-br-xl opacity-50"></div>

                    {/* Badge Content */}
                    <div className="relative z-10">
                        {/* Photo */}
                        <div className="mb-4 flex justify-center">
                            <img
                                src={latestBadge.photoDataUrl}
                                alt={`${latestBadge.name}'s badge photo`}
                                className="w-32 h-32 rounded-full object-cover border-4 border-cyan-600 shadow-lg"
                            />
                        </div>

                        {/* Name */}
                        <h3 className="text-2xl font-semibold text-white mb-1 truncate" title={latestBadge.name}>{latestBadge.name}</h3>

                        {/* Badge ID */}
                        <p className="text-lg font-mono text-cyan-300 mb-4 bg-black/30 px-2 py-1 rounded inline-block">{latestBadge.badgeId}</p>

                        {/* QR Code */}
                        <div className="bg-white p-3 rounded-lg shadow-inner inline-block mb-4">
                            <QRCode value={qrCodeValue} size={128} level="M" />
                        </div>

                        {/* Timestamp (Optional) */}
                        {/* <p className="text-xs text-gray-500 mt-2">Issued: {new Date(latestBadge.timestamp).toLocaleString()}</p> */}
                    </div>
                </div>
            )}

            {!latestBadge && !error && (
                 <p className="text-gray-400 text-lg">Loading badge data...</p>
            )}

             {/* Button to register another (if limit not reached) */}
             {/* You might want a button here to navigate back to /scan to register another person */}
             {/* Need to check badge count again */}
             {/* <button onClick={() => navigate('/scan')} className="mt-6 ...">Register Another Person</button> */}
        </div>
    );
};

export default BadgePage;

