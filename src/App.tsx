import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ScannerPage from './pages/ScannerPage';
import RegisterPage from './pages/RegisterPage';
import PhotoCapturePage from './pages/PhotoCapturePage'; // Import the new page
import BadgePage from './pages/BadgePage';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scan" element={<ScannerPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/photo-capture" element={<PhotoCapturePage />} /> {/* Add route for photo capture */}
          <Route path="/badge" element={<BadgePage />} />
          {/* Add a fallback route or redirect if needed */}
          <Route path="*" element={<HomePage />} /> 
        </Routes>
      </main>
      {/* Optional Footer */}
      {/* <footer className="text-center py-4 text-gray-500 text-sm">
        Credit: KIRITO
      </footer> */}
    </div>
  );
}

export default App;

