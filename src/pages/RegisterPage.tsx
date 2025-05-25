import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const REGISTRATION_STATUS_KEY = "mituki_registration_status"; // Keep for initial check? No, use BADGES_KEY count.
const BADGES_KEY = "mituki_badges_data";
const MAX_BADGES_PER_DEVICE = 5;
const CAN_REGISTER_FLAG_KEY = "mituki_can_register"; // sessionStorage key

const RegisterPage = () => {
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check access permission and badge count on mount
  useEffect(() => {
    const canRegister = sessionStorage.getItem(CAN_REGISTER_FLAG_KEY);
    const existingBadgesStr = localStorage.getItem(BADGES_KEY);
    const badges = existingBadgesStr ? JSON.parse(existingBadgesStr) : [];

    if (badges.length >= MAX_BADGES_PER_DEVICE) {
        setError(`Badge limit (${MAX_BADGES_PER_DEVICE}) reached for this device.`);
        // Optionally redirect to a specific page or just disable input
        // navigate('/limit-reached');
        sessionStorage.removeItem(CAN_REGISTER_FLAG_KEY); // Clear flag if limit reached
        return; // Prevent further action
    }

    if (canRegister !== 'true') {
      // If no permission flag, redirect to scanner
      console.log("Access denied to registration page without scan.");
      navigate('/scan');
    }

  }, [navigate]);

  const handleNext = () => {
    // Re-check permission just in case
    if (sessionStorage.getItem(CAN_REGISTER_FLAG_KEY) !== 'true') {
        setError("Registration session expired. Please scan again.");
        navigate('/scan');
        return;
    }

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    // Check badge count again before proceeding
    const existingBadgesStr = localStorage.getItem(BADGES_KEY);
    const badges = existingBadgesStr ? JSON.parse(existingBadgesStr) : [];
    if (badges.length >= MAX_BADGES_PER_DEVICE) {
        setError(`Badge limit (${MAX_BADGES_PER_DEVICE}) reached for this device.`);
        sessionStorage.removeItem(CAN_REGISTER_FLAG_KEY); // Clear flag
        return;
    }

    // Navigate to the photo capture page, passing the name
    navigate('/photo-capture', { state: { name: name.trim() } });
  };

  // Check if limit is reached to disable input/button
  const isLimitReached = () => {
      const existingBadgesStr = localStorage.getItem(BADGES_KEY);
      const badges = existingBadgesStr ? JSON.parse(existingBadgesStr) : [];
      return badges.length >= MAX_BADGES_PER_DEVICE;
  }

  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-semibold mb-6">Register Your Badge</h2>
      <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        {isLimitReached() ? (
             <p className="text-yellow-500 mb-4">Badge limit ({MAX_BADGES_PER_DEVICE}) reached for this device. Cannot register more participants.</p>
        ) : (
            <>
                <p className="mb-4 text-gray-300">You have successfully scanned the event code. Please enter the participant's name.</p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter participant's name"
                  className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  disabled={isLimitReached()}
                />
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button
                  onClick={handleNext}
                  className={`w-full text-white font-bold py-3 px-4 rounded transition duration-300 ease-in-out ${isLimitReached() ? 'bg-gray-600 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700'}`}
                  disabled={isLimitReached()}
                >
                  Next: Capture Photo
                </button>
            </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;

