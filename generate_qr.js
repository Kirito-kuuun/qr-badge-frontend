import QRCode from "qrcode";
import path from "path";
import { fileURLToPath } from 'url';

// Replicate __dirname behavior in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const qrValue = "MITUKI-BADGE-SCAN"; // Value to encode in the QR code
const outputPath = path.join(__dirname, "../dashboard/public/images/event_badge_qr.png"); // Save in dashboard images

QRCode.toFile(outputPath, qrValue, {
  errorCorrectionLevel: "H",
  type: "png",
  width: 512,
  margin: 2,
  color: {
    dark:"#000000",
    light:"#FFFFFF"
  }
}).then(() => {
  console.log(`QR code saved to ${outputPath}`);
}).catch(err => {
  console.error("Error generating QR code:", err);
});

