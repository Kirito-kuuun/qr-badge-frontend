import { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import { Result } from '@zxing/library';
import { useNavigate } from 'react-router-dom';

const ADMIN_QR_VALUE = "MITUKI-BADGE-SCAN";
const REGISTRATION_STATUS_KEY = "mituki_registration_status";
const CAN_REGISTER_FLAG_KEY = "mituki_can_register"; // sessionStorage key

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const status = localStorage.getItem(REGISTRATION_STATUS_KEY);
    if (status === 'registered') {
      setIsRegistered(true);
      setError("This device has already received a badge.");
    }
    // Clear any leftover registration flag on scanner page load
    sessionStorage.removeItem(CAN_REGISTER_FLAG_KEY);
  }, []);

  const handleScan = (result: Result | null | undefined, scanError: Error | null | undefined) => {
    if (isRegistered) return;

    if (result) {
      const scannedText = result.getText();
      setScanResult(scannedText);
      setError(null);

      if (scannedText === ADMIN_QR_VALUE) {
        const currentStatus = localStorage.getItem(REGISTRATION_STATUS_KEY);
        if (currentStatus === 'registered') {
          setIsRegistered(true);
          setError("This device has already received a badge.");
        } else {
          // Set flag to allow registration
          sessionStorage.setItem(CAN_REGISTER_FLAG_KEY, 'true');
          // Navigate to registration page
          navigate('/register');
        }
      } else {
        setError("Invalid event QR code scanned.");
      }
    }

    if (scanError) {
      if (scanError.name !== 'NotAllowedError' && scanError.name !== 'NotFoundError') {
        console.info('QR Scan Error:', scanError);
        if (!isRegistered) {
            setError('Failed to scan QR code. Please ensure camera access is allowed and try again.');
        }
      }
    }
  };

  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-semibold mb-4">Scan Event QR Code</h2>
      {isRegistered ? (
        <p className="text-yellow-500 text-lg p-4 bg-gray-800 rounded shadow">This device has already received a badge. Please go to 'Mon Badge'.</p>
      ) : (
        <>
          <div className="max-w-md mx-auto border-2 border-dashed border-gray-500 p-4 rounded-lg mb-4 bg-gray-800 shadow-lg relative overflow-hidden" style={{ paddingTop: '100%' }}>
            <div className="absolute top-0 left-0 w-full h-full">
              <QrReader
                onResult={handleScan}
                constraints={{ facingMode: 'environment' }}
                scanDelay={500}
                className="w-full h-full object-cover"
                videoContainerStyle={{ paddingTop: '0', width: '100%', height: '100%' }}
                videoStyle={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
          </div>
          {error && <p className="text-red-500 mt-2">Error: {error}</p>}
          {scanResult && <p className="mt-4 text-lg font-mono bg-gray-700 p-3 rounded shadow">Last Scan: <span className="text-gray-400">{scanResult}</span></p>}
        </>
      )}
    </div>
  );
};

export default ScannerPage;

