import { Link } from 'react-router-dom'; // Removed unused React import
import logo from '../images/logo.jpeg';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white p-4 shadow-lg border-b border-futuristic-cyan/30 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center group">
          <img 
            src={logo} 
            alt="MITUKI Logo" 
            className="h-12 w-auto mr-3 rounded-full border-2 border-transparent group-hover:border-futuristic-cyan transition-all duration-300"
          />
          <h1 className="text-xl font-bold tracking-wider group-hover:text-futuristic-cyan transition-colors duration-300">MITUKI</h1> 
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li><Link to="/" className="text-gray-300 hover:text-futuristic-cyan transition-colors duration-300 text-lg relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-futuristic-cyan after:transition-all after:duration-300 hover:after:w-full">Accueil</Link></li>
            <li><Link to="/scan" className="text-gray-300 hover:text-futuristic-cyan transition-colors duration-300 text-lg relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-futuristic-cyan after:transition-all after:duration-300 hover:after:w-full">Scanner</Link></li>
            <li><Link to="/badge" className="text-gray-300 hover:text-futuristic-cyan transition-colors duration-300 text-lg relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-futuristic-cyan after:transition-all after:duration-300 hover:after:w-full">Mon Badge</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

